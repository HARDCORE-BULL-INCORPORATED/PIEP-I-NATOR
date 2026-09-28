import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory, SlotButtonId } from '../@types/index.js';
import { SPIN_ATTACHMENT_NAME, SUMMARY_ATTACHMENT_NAME, SlotMachineRenderer } from '../lib/slotmachine/SlotMachineRenderer.js';
import { SLOT_RARITY_LABEL_KEYS, SLOT_RARITY_ORDER } from '../lib/slotmachine/SlotMachine.types.js';
import { getAllSlotMachines, getDefaultSlotMachine, getSlotMachine, getSlotMachineChoices } from '../lib/slotmachine/machines/index.js';

import type { ButtonInteraction, Client, Collection, Message } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type SlotMachine from '../lib/slotmachine/SlotMachine.js';
import type { SlotItem, SlotRarity, SpinResult } from '../lib/slotmachine/SlotMachine.types.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


const SPIN_FIVE_COUNT = 5;
const COLLECTOR_TIMEOUT_MS = 90_000;
const RESULT_REVEAL_DELAY_MS = 200;


type SlotSession = {
    spins: number;
    bestItem: SlotItem | null;
    busy: boolean;
};

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Slot machine command - opens CS:GO style cases with an animated unboxing
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
        const session: SlotSession = { spins: 0, bestItem: null, busy: true };

        const msg = await context.reply({
            embeds: [renderer.buildLoadingEmbed(context.t('commands:MESSAGE_SLOT_UNBOXING'))],
            components: [this.#buildButtons(context, true)]
        });

        await this.#openCase(bot, context, msg, renderer, machine, session);
        this.#createCollector(bot, context, msg, renderer, machine, session);
    }

    /**
     * Open one case: render the landing GIF, play it, then reveal the result
     * @private
     */
    async #openCase(
        bot: Bot,
        context: CommandContext,
        msg: Message,
        renderer: SlotMachineRenderer,
        machine: SlotMachine,
        session: SlotSession
    ): Promise<void> {
        session.busy = true;

        try {
            const result = machine.spin();
            const gif = await renderer.renderSpinGif(result);

            await msg.edit({
                embeds: [renderer.buildSpinEmbed(result, context.t('commands:MESSAGE_SLOT_UNBOXING'))],
                components: [this.#buildButtons(context, true)],
                files: [new AttachmentBuilder(gif, { name: SPIN_ATTACHMENT_NAME })],
                attachments: []
            });

            await delay(renderer.spinDurationMs + RESULT_REVEAL_DELAY_MS);

            session.spins += 1;
            session.bestItem = this.#bestItem(session.bestItem, result.item);

            await msg.edit({
                embeds: [renderer.buildSpinEmbed(
                    result,
                    this.#resultText(context, result),
                    this.#sessionText(context, session)
                )],
                components: [this.#buildButtons(context, false)]
            });
        } catch (error) {
            bot.logger.error(bot.shardId, `[slot] Failed to open a case: ${error}`);
            await this.#setButtons(msg, context, false);
        } finally {
            session.busy = false;
        }
    }

    /**
     * Open five cases at once and reveal them as one summary image
     * @private
     */
    async #openFiveCases(
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
            const image = await renderer.renderSummaryImage(results);

            session.spins += SPIN_FIVE_COUNT;
            for (const result of results) {
                session.bestItem = this.#bestItem(session.bestItem, result.item);
            }

            const lines = results.map(result => renderer.renderResultLine(result, this.#rarityLabel(context, result.item.rarity)));

            await msg.edit({
                embeds: [renderer.buildSummaryEmbed(
                    context.t('commands:MESSAGE_SLOT_SPIN_FIVE_TITLE'),
                    lines,
                    this.#sessionText(context, session)
                )],
                components: [this.#buildButtons(context, false)],
                files: [new AttachmentBuilder(image, { name: SUMMARY_ATTACHMENT_NAME })],
                attachments: []
            });
        } catch (error) {
            bot.logger.error(bot.shardId, `[slot] Failed to open five cases: ${error}`);
            await this.#setButtons(msg, context, false);
        } finally {
            session.busy = false;
        }
    }

    /**
     * Attach the button collector that drives repeat openings
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
                await this.#openFiveCases(bot, context, msg, renderer, machine, session);
                return;
            }

            await this.#openCase(bot, context, msg, renderer, machine, session);
        });

        collector.on('end', async (_collected: Collection<string, ButtonInteraction>, reason: string) => {
            if (reason !== 'time') return;
            await this.#setButtons(msg, context, true);
        });
    }

    /**
     * Build the case opening controls, optionally disabled
     * @private
     */
    #buildButtons(context: CommandContext, disabled: boolean): ActionRowBuilder<ButtonBuilder> {
        const openButton = new ButtonBuilder()
            .setCustomId(SlotButtonId.Spin)
            .setLabel(context.t('commands:MESSAGE_SLOT_BUTTON_SPIN'))
            .setEmoji('🎁')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled);

        const openFiveButton = new ButtonBuilder()
            .setCustomId(SlotButtonId.SpinFive)
            .setLabel(context.t('commands:MESSAGE_SLOT_BUTTON_SPIN_FIVE'))
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled);

        return new ActionRowBuilder<ButtonBuilder>().addComponents(openButton, openFiveButton);
    }

    /**
     * Edit the message controls, ignoring deleted or expired messages
     * @private
     */
    async #setButtons(msg: Message, context: CommandContext, disabled: boolean): Promise<void> {
        try {
            await msg.edit({ components: [this.#buildButtons(context, disabled)] });
        } catch (_) {
            // Message was already deleted when the buttons were updated
        }
    }

    /**
     * Format the localized status line for a finished unboxing
     * @private
     */
    #resultText(context: CommandContext, result: SpinResult): string {
        return context.t('commands:MESSAGE_SLOT_UNBOXED', {
            item: result.item.name,
            rarity: this.#rarityLabel(context, result.item.rarity)
        });
    }

    /**
     * Format the localized session summary
     * @private
     */
    #sessionText(context: CommandContext, session: SlotSession): string {
        return context.t('commands:MESSAGE_SLOT_SESSION', {
            spins: session.spins,
            best: session.bestItem?.name ?? ''
        });
    }

    /**
     * Localize one rarity tier
     * @private
     */
    #rarityLabel(context: CommandContext, rarity: SlotRarity): string {
        return context.t(`commands:${SLOT_RARITY_LABEL_KEYS[rarity]}`);
    }

    /**
     * Keep the rarest item pulled during the session
     * @private
     */
    #bestItem(current: SlotItem | null, candidate: SlotItem): SlotItem {
        if (!current) return candidate;

        return SLOT_RARITY_ORDER.indexOf(candidate.rarity) > SLOT_RARITY_ORDER.indexOf(current.rarity)
            ? candidate
            : current;
    }
}
