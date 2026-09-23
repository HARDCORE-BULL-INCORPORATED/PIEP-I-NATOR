import {
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js';
import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory, SelectButtonId } from '../@types/index.js';
import { embeds } from '../embeds/index.js';
import {
    FILTER_CATEGORIES,
    getFiltersByCategory,
    resolveFilter,
    suggestFilters
} from '../utils/filters/index.js';

import type { AutocompleteInteraction, Client, MessageComponentInteraction } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


export class FilterCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'filter',
            aliases: ['eq', 'equalizer'],
            description: i18next.t('commands:CONFIG_FILTER_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_FILTER_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: true,
            showHelp: true,
            sendTyping: true,
            options: [
                {
                    name: 'filter',
                    description: i18next.t('commands:CONFIG_FILTER_OPTION_DESCRIPTION', { lng }),
                    type: 3,
                    required: false,
                    autocomplete: true
                }
            ]
        };
    }

    protected async run(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        const player = client.lavashark.getPlayer(context.guild!.id);

        if (!player || !player.playing) {
            await context.replyEphemeralError(bot, context.t('commands:ERROR_NO_PLAYING'));
            return;
        }

        // Get filter parameter
        const filterParam = context.isInteraction()
            ? context.getStringOption('filter')
            : context.args.join(' ');

        if (!filterParam) {
            // Show interactive filter selection
            await this.#showFilterSelection(bot, client, context, player);
            return;
        }

        // Apply filter directly
        await this.#applyFilter(bot, client, context, player, filterParam);
    }

    /**
     * Answer autocomplete requests with matching filter names
     */
    public async autocomplete(bot: Bot, client: Client, interaction: AutocompleteInteraction): Promise<void> {
        const lng = bot.guildLanguageManager?.get(interaction.guildId!) || bot.config.bot.i18n.defaultLocale;
        const focused = interaction.options.getFocused();
        const query = typeof focused === 'string' ? focused : '';

        const choices = suggestFilters(query).map((filter) => ({
            name: filter.label,
            value: filter.name
        }));

        if ('clear'.startsWith(query.trim().toLowerCase())) {
            choices.unshift({
                name: bot.i18n.t('commands:LABEL_FILTER_CLEAR', { lng }) as string,
                value: 'clear'
            });
        }

        await interaction.respond(choices.slice(0, 25));
    }

    /**
     * Show interactive filter selection menus
     * @private
     */
    async #showFilterSelection(
        bot: Bot,
        client: Client,
        context: CommandContext,
        player: any
    ): Promise<void> {
        const rows = FILTER_CATEGORIES.map((category) => {
            const select = new StringSelectMenuBuilder()
                .setCustomId(`${SelectButtonId.Filter}:${category}`)
                .setPlaceholder(context.t(`commands:MESSAGE_FILTER_CATEGORY_${category.toUpperCase()}`))
                .setOptions(getFiltersByCategory(category).map((filter) => ({
                    label: filter.label,
                    value: filter.name
                })));

            return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
        });

        const msg = await context.reply({
            embeds: [embeds.textMsg(bot, context.t('commands:MESSAGE_FILTER_SELECT_LIST'))],
            components: rows.map((row) => row.toJSON()),
            allowedMentions: { repliedUser: false }
        });

        const collector = msg.createMessageComponentCollector({
            time: 30000, // 30s
            filter: (i) => i.user.id === context.user.id && i.customId.startsWith(SelectButtonId.Filter)
        });

        collector.on('collect', async (i: MessageComponentInteraction) => {
            if (!i.isStringSelectMenu()) return;

            const filter = resolveFilter(i.values[0]);

            if (!filter) {
                await i.reply({
                    embeds: [embeds.textErrorMsg(bot, context.t('commands:MESSAGE_FILTER_NOT_FOUND'))],
                    allowedMentions: { repliedUser: false }
                }).catch(() => {});
                collector.stop();
                return;
            }

            player.filters.set(filter.options);

            if (context.isMessage()) {
                await context.react('👍');
            }

            await i.deferUpdate();
            await msg.edit({
                embeds: [embeds.filterMsg(bot, filter.label, context.language)],
                components: [],
                allowedMentions: { repliedUser: false }
            }).catch(() =>
                bot.logger.discord( bot.shardId, 'Failed to edit deleted message.')
            );

            collector.stop();
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                await msg.edit({
                    embeds: [embeds.textErrorMsg(bot, context.t('commands:ERROR_TIME_EXPIRED'))],
                    components: [],
                    allowedMentions: { repliedUser: false }
                }).catch(() =>
                    bot.logger.discord( bot.shardId, 'Failed to edit deleted message.')
                );
            }
        });
    }

    /**
     * Apply a filter directly
     * @private
     */
    async #applyFilter(
        bot: Bot,
        client: Client,
        context: CommandContext,
        player: any,
        filterParam: string
    ): Promise<void> {
        const normalized = filterParam.trim().toLowerCase();

        if (normalized === 'clear') {
            player.filters.clear();

            if (context.isMessage()) {
                await context.react('👍');
            }

            await context.reply({
                embeds: [embeds.filterMsg(bot, context.t('commands:LABEL_FILTER_CLEAR'), context.language)],
                components: [],
                allowedMentions: { repliedUser: false }
            }).catch(() =>
                bot.logger.discord( bot.shardId, 'Failed to edit message.')
            );
            return;
        }

        const filter = resolveFilter(filterParam);

        if (!filter) {
            await context.replyEphemeralError(bot, context.t('commands:MESSAGE_FILTER_NOT_FOUND'));
            return;
        }

        player.filters.set(filter.options);

        if (context.isMessage()) {
            await context.react('👍');
        }

        await context.reply({
            embeds: [embeds.filterMsg(bot, filter.label, context.language)],
            components: [],
            allowedMentions: { repliedUser: false }
        }).catch(() =>
            bot.logger.discord( bot.shardId, 'Failed to edit message.')
        );
    }
}
