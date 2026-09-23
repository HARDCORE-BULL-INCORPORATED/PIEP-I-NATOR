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
    resolveFilter
} from '../utils/filters/index.js';

import type { Client, MessageComponentInteraction } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata, FilterCategory } from '../@types/index.js';


export class FiltersCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'filters',
            aliases: ['filterlist', 'filterinfo'],
            description: i18next.t('commands:CONFIG_FILTERS_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_FILTERS_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: false,
            showHelp: true,
            sendTyping: true,
            options: []
        };
    }

    protected async run(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        const defaultCategory = FILTER_CATEGORIES[0];

        const msg = await context.reply({
            embeds: [embeds.filterList(bot, defaultCategory, context.language)],
            components: this.#buildComponents(context, defaultCategory),
            allowedMentions: { repliedUser: false }
        });

        const collector = msg.createMessageComponentCollector({
            time: 120000, // 2 minutes
            filter: (i) => i.user.id === context.user.id
                && (i.customId === SelectButtonId.FilterListCategory || i.customId === SelectButtonId.FilterListFilter)
        });

        collector.on('collect', async (i: MessageComponentInteraction) => {
            if (!i.isStringSelectMenu()) return;

            // Show the overview of another category
            if (i.customId === SelectButtonId.FilterListCategory) {
                const category = i.values[0] as FilterCategory;

                if (!FILTER_CATEGORIES.includes(category)) return;

                await i.deferUpdate();
                await msg.edit({
                    embeds: [embeds.filterList(bot, category, context.language)],
                    components: this.#buildComponents(context, category),
                    allowedMentions: { repliedUser: false }
                }).catch(() =>
                    bot.logger.discord( bot.shardId, 'Failed to edit deleted message.')
                );
                return;
            }

            // Show the technical details of the selected filter
            const filter = resolveFilter(i.values[0]);

            if (!filter) return;

            await i.deferUpdate();
            await msg.edit({
                embeds: [embeds.filterDetail(bot, filter, context.language)],
                components: this.#buildComponents(context, filter.category, filter.name),
                allowedMentions: { repliedUser: false }
            }).catch(() =>
                bot.logger.discord( bot.shardId, 'Failed to edit deleted message.')
            );
        });

        collector.on('end', async (_collected, reason) => {
            if (reason !== 'time') return;

            await msg.edit({ components: [] }).catch(() =>
                bot.logger.discord( bot.shardId, 'Failed to edit deleted message.')
            );
        });
    }

    /**
     * Build the category and filter selection menus
     * @private
     */
    #buildComponents(
        context: CommandContext,
        category: FilterCategory,
        selectedFilter?: string
    ): ActionRowBuilder<StringSelectMenuBuilder>[] {
        const categorySelect = new StringSelectMenuBuilder()
            .setCustomId(SelectButtonId.FilterListCategory)
            .setPlaceholder(context.t('commands:MESSAGE_FILTERS_SELECT_CATEGORY'))
            .setOptions(FILTER_CATEGORIES.map((entry) => ({
                label: context.t(`commands:MESSAGE_FILTER_CATEGORY_${entry.toUpperCase()}`),
                value: entry,
                default: entry === category
            })));

        const filterSelect = new StringSelectMenuBuilder()
            .setCustomId(SelectButtonId.FilterListFilter)
            .setPlaceholder(context.t('commands:MESSAGE_FILTERS_SELECT_FILTER'))
            .setOptions(getFiltersByCategory(category).map((filter) => ({
                label: filter.label,
                value: filter.name,
                default: filter.name === selectedFilter
            })));

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categorySelect),
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(filterSelect)
        ];
    }
}
