import { ComponentType, MessageFlags } from 'discord.js';
import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory, RecentlyPlayedButtonId } from '../@types/index.js';
import { embeds } from '../embeds/index.js';
import { RECENTLY_PLAYED_PAGE_SIZE } from '../embeds/recentlyPlayed.embed.js';

import type { Client } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


const PAGINATION_TIMEOUT_MS = 120_000;


/**
 * Recently played command - Shows a paginated list of the last plays of the current server
 */
export class RecentlyPlayedCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'recentlyplayed',
            aliases: ['recent', 'history'],
            description: i18next.t('commands:CONFIG_RECENTLY_PLAYED_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_RECENTLY_PLAYED_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: false,
            showHelp: true,
            sendTyping: false,
            options: []
        };
    }

    protected async run(bot: Bot, _client: Client, context: CommandContext): Promise<void> {
        const guildId = context.guildId;
        const manager = bot.playCountManager;

        // Freeze the history so pages stay stable while new tracks start playing
        const snapshotAt = Date.now();
        const totalPlays = guildId && manager ? manager.getPlayHistoryCount(guildId, snapshotAt) : 0;

        if (!guildId || !manager || totalPlays === 0) {
            await context.replyEphemeralError(bot, context.t('commands:ERROR_NO_PLAY_HISTORY'));
            return;
        }

        const totalPages = Math.ceil(totalPlays / RECENTLY_PLAYED_PAGE_SIZE);
        let currentPage = 1;

        const message = await context.reply({
            embeds: [embeds.recentlyPlayed(
                bot,
                manager.getPlayHistoryPage(guildId, RECENTLY_PLAYED_PAGE_SIZE, 0, snapshotAt),
                0,
                currentPage,
                totalPages,
                context.language,
            )],
            components: totalPages > 1
                ? [embeds.recentlyPlayedButtons(currentPage, totalPages)]
                : [],
            allowedMentions: { repliedUser: false },
        });

        if (context.isMessage()) {
            await context.react('👍');
        }

        if (totalPages <= 1) return;

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: PAGINATION_TIMEOUT_MS,
        });

        collector.on('collect', async (interaction) => {
            // Restrict pagination controls to the command user
            if (interaction.user.id !== context.user.id) {
                await interaction.reply({
                    content: context.t('commands:ERROR_ONLY_COMMAND_USER_PAGINATE'),
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            if (interaction.customId === RecentlyPlayedButtonId.Previous) {
                currentPage = Math.max(1, currentPage - 1);
            }
            else if (interaction.customId === RecentlyPlayedButtonId.Next) {
                currentPage = Math.min(totalPages, currentPage + 1);
            }
            else {
                return;
            }

            const offset = (currentPage - 1) * RECENTLY_PLAYED_PAGE_SIZE;

            await interaction.update({
                embeds: [embeds.recentlyPlayed(
                    bot,
                    manager.getPlayHistoryPage(guildId, RECENTLY_PLAYED_PAGE_SIZE, offset, snapshotAt),
                    offset,
                    currentPage,
                    totalPages,
                    context.language,
                )],
                components: [embeds.recentlyPlayedButtons(currentPage, totalPages)],
            });
        });

        collector.on('end', async () => {
            // Keep the final page visible while disabling expired controls
            try {
                await message.edit({
                    components: [embeds.recentlyPlayedButtons(currentPage, totalPages, true)],
                });
            } catch (error) {
                bot.logger.error(bot.shardId, `[RecentlyPlayedCommand] Failed to disable pagination: ${error}`);
            }
        });
    }
}
