import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory } from '../@types/index.js';
import { embeds } from '../embeds/index.js';

import type { Client } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


/** Rolling window shown next to the current session */
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;


/**
 * Moee command - Shows how many songs were listened to in the current session and the last 24 hours
 */
export class MoeeCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'moee',
            aliases: [],
            description: i18next.t('commands:CONFIG_MOEE_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_MOEE_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: false,
            showHelp: true,
            sendTyping: true,
            options: []
        };
    }

    protected async run(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        const guildId = context.guildId;
        const manager = bot.playCountManager;

        if (!guildId || !manager) {
            await context.replyEphemeralError(bot, context.t('commands:ERROR_NO_PLAY_HISTORY'));
            return;
        }

        // The player only exists while the bot is connected to a voice channel, so a missing
        // session start simply means no listening session is active
        const player = client.lavashark.getPlayer(guildId);
        const sessionCount = player?.sessionStartedAt
            ? manager.getPlayHistoryCountSince(guildId, player.sessionStartedAt)
            : 0;
        const dailyCount = manager.getPlayHistoryCountSince(guildId, Date.now() - DAILY_WINDOW_MS);

        // Old plays outside both windows are valid stats and render as zeros
        if (sessionCount === 0 && dailyCount === 0 && manager.getPlayHistoryCount(guildId, Date.now()) === 0) {
            await context.replyEphemeralError(bot, context.t('commands:ERROR_NO_PLAY_HISTORY'));
            return;
        }

        await context.reply({
            embeds: [embeds.moee(bot, sessionCount, dailyCount, context.language)],
        });
    }
}
