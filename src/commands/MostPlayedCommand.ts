import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory } from '../@types/index.js';
import { embeds } from '../embeds/index.js';

import type { Client } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


/** Maximum number of songs shown by the command */
const MAX_ENTRIES = 10;


/**
 * Most played command - Shows the most played songs of the current server
 */
export class MostPlayedCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'mostplayed',
            aliases: ['top'],
            description: i18next.t('commands:CONFIG_MOST_PLAYED_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_MOST_PLAYED_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: false,
            showHelp: true,
            sendTyping: true,
            options: []
        };
    }

    protected async run(bot: Bot, _client: Client, context: CommandContext): Promise<void> {
        const guildId = context.guildId;
        const entries = guildId
            ? bot.playCountManager?.getMostPlayed(guildId, MAX_ENTRIES) ?? []
            : [];

        if (entries.length === 0) {
            await context.replyEphemeralError(bot, context.t('commands:ERROR_NO_PLAY_HISTORY'));
            return;
        }

        await context.reply({
            embeds: [embeds.mostPlayed(bot, entries, context.language)]
        });
    }
}
