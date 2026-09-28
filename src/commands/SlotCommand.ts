import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory, SlotButtonId } from '../@types/index.js';
import { SlotMachineRenderer } from '../lib/slotmachine/SlotMachineRenderer.js';
import { getAllSlotMachines, getDefaultSlotMachine, getSlotMachine, getSlotMachineChoices } from '../lib/slotmachine/machines/index.js';

import type { ButtonInteraction, Client, Collection, Message } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type SlotMachine from '../lib/slotmachine/SlotMachine.js';
import type { SpinResult } from '../lib/slotmachine/SlotMachine.types.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


const FILLER_FRAME_COUNT = 3;
const FRAME_DELAYS_MS = [0, 450, 650, 850];
const SPIN_FIVE_COUNT = 5;
const COLLECTOR_TIMEOUT_MS = 90_000;


type SlotSession = {
    spins: number;
    score: number;
    busy: boolean;
};

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Slot machine command - plays a configurable reel machine with buttons
 */
export class SlotCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'slot',
            aliases: ['slots'],
            description: i18next.t('commands:CONFIG_SLOT_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_SLOT_USAGE', { lng }),
            category: CommandCategory.GAMES,
            voiceChannel: false,
            showHelp: true,
            sendTyping: true,
            options: [
                {
                    name: 'machine',
                    description: i18next.t('commands:CONFIG_SLOT_OPTION_MACHINE', { lng }),
                    type: 3,
                    required: false,
                    choices: getSlotMachineChoices()
                }
            ]
        };
    }

    protected async run(bot: Bot, _client: Client, context: CommandContext): Promise<void> {
        const machineInput = context.isInteraction()
            ? context.getStringOption('machine')
            : context.args[0];

        const machine = machineInput ? getSlotMachine(machineInput) : getDefaultSlotMachine();

        if (!machine) {
            const available = getAllSlotMachines().map(entry => `\`${entry.id}\``).join(', ');
            await context.replyEphemeralError(bot, context.t('commands:MESSAGE_SLOT_UNKNOWN_MACHINE', {
                machine: machineInput,
                machines: available
            }));
            return;
        }

        const renderer = new SlotMachineRenderer(machine);
        const session: SlotSession = { spins: 0, score: 0, busy: true };
        const frames = this.#createFrames(machine);

        const msg = await context.reply({
            embeds: [renderer.buildSpinEmbed(frames[0], context.t('commands:MESSAGE_SLOT_SPINNING'))],
            components: [this.#buildButtons(context, true)]
        });

        await this.#playSpinSequence(bot, context, msg, renderer, session, frames, 1);

        this.#createCollector(bot, context, msg, renderer, machine, session);
    }

    /**
     * Create the filler frames and the final result
     * @private
     */
    #createFrames(machine: SlotMachine): SpinResult[] {
        return Array.from({ length: FILLER_FRAME_COUNT + 1 }, () => machine.spin());
    }

    /**
     * Animate a spin sequence by editing the message frame by frame
     * @private
     */
    async #playSpinSequence(
        bot: Bot,
        context: CommandContext,
        msg: Message,
        renderer: SlotMachineRenderer,
        session: SlotSession,
        frames: SpinResult[],
        startIndex: number
    ): Promise<void> {
        session.busy = true;

        try {
            for (let index = startIndex; index < frames.length; index++) {
                const isResult = index === frames.length - 1;

                if (!(index === 0 && startIndex === 0)) {
                    await delay(FRAME_DELAYS_MS[index] ?? FRAME_DELAYS_MS[FRAME_DELAYS_MS.length - 1]);
                }

                if (isResult) {
                    session.spins += 1;
                    session.score += frames[index].payout;
                }

                const status = isResult
                    ? this.#resultText(context, frames[index])
                    : context.t('commands:MESSAGE_SLOT_SPINNING');
                const footer = session.spins > 0 ? this.#sessionText(context, session) : undefined;

                await msg.edit({
                    embeds: [renderer.buildSpinEmbed(frames[index], status, footer)],
                    components: [this.#buildButtons(context, !isResult)]
                });
            }
        } catch (error) {
            bot.logger.error(bot.shardId, `[slot] Failed to update spin frame: ${error}`);
        } finally {
            session.busy = false;
        }
    }

    /**
     * Reveal five spins at once without an animation
     * @private
     */
    async #showFiveSpins(
        bot: Bot,
        context: CommandContext,
        msg: Message,
        renderer: SlotMachineRenderer,
        machine: SlotMachine,
        session: SlotSession
    ): Promise<void> {
        session.busy = true;

        try {
            const results = Array.from({ length: SPIN_FIVE_COUNT }, () => machine.spin());
            session.spins += SPIN_FIVE_COUNT;
            session.score += results.reduce((sum, result) => sum + result.payout, 0);

            const lines = results.map(result =>
                renderer.renderResultLine(result, context.t('commands:MESSAGE_SLOT_MISS'))
            );

            await msg.edit({
                embeds: [renderer.buildSummaryEmbed(
                    context.t('commands:MESSAGE_SLOT_SPIN_FIVE_TITLE'),
                    lines,
                    this.#sessionText(context, session)
                )],
                components: [this.#buildButtons(context, false)]
            });
        } catch (error) {
            bot.logger.error(bot.shardId, `[slot] Failed to show five spins: ${error}`);
        } finally {
            session.busy = false;
        }
    }

    /**
     * Attach the button collector that drives repeat spins
     * @private
     */
    #createCollector(
        bot: Bot,
        context: CommandContext,
        msg: Message,
        renderer: SlotMachineRenderer,
        machine: SlotMachine,
        session: SlotSession
    ): void {
        const collector = msg.createMessageComponentCollector({
            time: COLLECTOR_TIMEOUT_MS,
            filter: interaction => interaction.user.id === context.user.id
                && (interaction.customId === SlotButtonId.Spin || interaction.customId === SlotButtonId.SpinFive)
        });

        collector.on('collect', async (interaction: ButtonInteraction) => {
            await interaction.deferUpdate().catch(() => { /* interaction already expired */ });

            if (session.busy) return;

            if (interaction.customId === SlotButtonId.SpinFive) {
                await this.#showFiveSpins(bot, context, msg, renderer, machine, session);
                return;
            }

            await this.#playSpinSequence(bot, context, msg, renderer, session, this.#createFrames(machine), 0);
        });

        collector.on('end', async (_collected: Collection<string, ButtonInteraction>, reason: string) => {
            if (reason !== 'time') return;

            try {
                await msg.edit({ components: [this.#buildButtons(context, true)] });
            } catch (_) {
                // Message was already deleted when the collector expired
            }
        });
    }

    /**
     * Build the spin controls, optionally disabled
     * @private
     */
    #buildButtons(context: CommandContext, disabled: boolean): ActionRowBuilder<ButtonBuilder> {
        const spinButton = new ButtonBuilder()
            .setCustomId(SlotButtonId.Spin)
            .setLabel(context.t('commands:MESSAGE_SLOT_BUTTON_SPIN'))
            .setEmoji('🎰')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled);

        const spinFiveButton = new ButtonBuilder()
            .setCustomId(SlotButtonId.SpinFive)
            .setLabel(context.t('commands:MESSAGE_SLOT_BUTTON_SPIN_FIVE'))
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled);

        return new ActionRowBuilder<ButtonBuilder>().addComponents(spinButton, spinFiveButton);
    }

    /**
     * Format the localized status line for a finished spin
     * @private
     */
    #resultText(context: CommandContext, result: SpinResult): string {
        if (result.matched) {
            return context.t('commands:MESSAGE_SLOT_WIN', {
                symbol: result.matched.name,
                payout: result.matched.payout
            });
        }

        return context.t('commands:MESSAGE_SLOT_LOSE');
    }

    /**
     * Format the localized session summary
     * @private
     */
    #sessionText(context: CommandContext, session: SlotSession): string {
        return context.t('commands:MESSAGE_SLOT_SESSION', {
            spins: session.spins,
            score: session.score
        });
    }
}
