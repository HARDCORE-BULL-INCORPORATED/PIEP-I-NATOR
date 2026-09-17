/**
 * Alimesami command - Queue the preset links from config with one command
 */
import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory, DJModeEnum, LoadType } from '../@types/index.js';
import { embeds } from '../embeds/index.js';
import { isUserInBlacklist } from '../utils/functions/isUserInBlacklist.js';
import { DJManager } from '../lib/DjManager.js';

import type { Client, GuildMember } from 'discord.js';
import type { Player } from 'lavashark';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


/** Delay between preset link searches to avoid hitting the node REST rate limits */
const SEARCH_PACING_MS = 400;

/** How many failed links are listed in the reply before the rest are summarized */
const MAX_FAILED_LINKS_DISPLAYED = 5;

/** Custom emoji used for the reaction and the success reply */
const PRESET_EMOJI = '<:HCMUSCLEBULL:1296488728545591407>';

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const formatFailedLinks = (links: string[]): string => {
    const shown = links
        .slice(0, MAX_FAILED_LINKS_DISPLAYED)
        .map((url) => `\`${url}\``)
        .join('\n');
    const remaining = links.length - MAX_FAILED_LINKS_DISPLAYED;
    return remaining > 0 ? `${shown}\n...and ${remaining} more` : shown;
};

/** Fisher-Yates shuffle, same effect as the shuffle command */
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Alimesami command - Play the preset list of links from the config
 */
export class AlimesamiCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'alimesami',
            aliases: [],
            description: i18next.t('commands:CONFIG_ALIMESAMI_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_ALIMESAMI_USAGE', { lng }),
            category: CommandCategory.MUSIC,
            voiceChannel: true,
            showHelp: true,
            sendTyping: true,
            options: []
        };
    }

    protected async run(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        const presetLinks = bot.config.presetLinks;
        if (presetLinks.length === 0) {
            await context.replyError(bot, context.t('commands:ERROR_ALIMESAMI_NO_LINKS'));
            return;
        }

        // Validate user is not in blacklist
        const voiceChannel = context.isMessage()
            ? context.getMessage().member?.voice.channel
            : context.getInteraction().guild!.members.cache.get(context.user.id)?.voice.channel;

        const validBlackist = isUserInBlacklist(voiceChannel, bot.config.blacklist, bot.blacklistManager);
        if (validBlackist.length > 0) {
            await context.reply({
                embeds: [embeds.blacklist(bot, validBlackist, context.language)]
            });
            return;
        }

        // Resolve every preset link sequentially, pacing requests to avoid hitting
        // the Lavalink node REST rate limits
        const resolvedTracks: any[] = [];
        const failedLinks: string[] = [];

        for (const url of presetLinks) {
            let res;
            try {
                res = await client.lavashark.search(url);
            } catch (error) {
                console.error(error);
                bot.logger.error(bot.shardId, `Search Error: ${error}`);
            }

            await sleep(SEARCH_PACING_MS);

            if (!res || res.loadType === LoadType.ERROR || res.loadType === LoadType.EMPTY || res.tracks.length === 0) {
                failedLinks.push(url);
                continue;
            }

            resolvedTracks.push(...res.tracks);
        }

        if (resolvedTracks.length === 0) {
            await context.replyError(bot, context.t('commands:ERROR_ALIMESAMI_NO_RESULTS', {
                links: formatFailedLinks(failedLinks)
            }));
            return;
        }

        // Create or get player
        const player = await this.#createPlayer(bot, client, context);
        if (!player) return;

        const requester = context.isMessage() ? context.getMessage().author : context.getInteraction().user;
        const curVolume = player.setting.volume ?? bot.guildVolumeManager?.get(player.guildId) ?? bot.config.bot.volume.default;

        // Shuffle the tracks, same effect as the shuffle command, before they are played
        player.addTracks(shuffleArray(resolvedTracks), requester as any);

        if (!player.playing) {
            player.filters.setVolume(curVolume);
            await player.play()
                .catch(async (error) => {
                    bot.logger.error(bot.shardId, 'Error playing track: ' + error);
                    await context.replyError(bot, context.t('commands:ERROR_PLAY_MUSIC', { reason: JSON.stringify(error) }));
                    return player.destroy();
                });
        }

        if (context.isMessage()) {
            await context.react(PRESET_EMOJI);
        }

        const queueTotal = player.queue.tracks.length + (player.current ? 1 : 0);
        const failureDetails = failedLinks.length > 0
            ? '\n' + context.t('commands:MESSAGE_ALIMESAMI_FAILED_LINKS', {
                skipped: failedLinks.length,
                links: formatFailedLinks(failedLinks)
            })
            : '';

        await context.replySuccess(bot, PRESET_EMOJI + ' ' + context.t('commands:MESSAGE_ALIMESAMI_ADDED', {
            added: resolvedTracks.length,
            queueTotal: queueTotal
        }) + failureDetails);
    }

    /**
     * Create and initialize player
     * @private
     */
    async #createPlayer(bot: Bot, client: Client, context: CommandContext): Promise<Player | null> {
        const voiceChannelId = context.isMessage()
            ? String(context.getMessage().member?.voice.channelId)
            : String(context.getInteraction().guild!.members.cache.get(context.user.id)?.voice.channelId);

        const player = client.lavashark.createPlayer({
            guildId: String(context.guild?.id),
            voiceChannelId: voiceChannelId,
            textChannelId: context.channel!.id,
            selfDeaf: true
        });

        if (!player.setting) {
            player.setting = {
                queuePage: null,
                volume: null,
                fairQueueRotation: []
            };
        }

        const metadata = context.isMessage() ? context.getMessage() : context.getInteraction();

        try {
            await player.connect();
            player.metadata = metadata;
        } catch (error) {
            bot.logger.error(bot.shardId, 'Error joining channel: ' + error);
            await context.replyEphemeralError(bot, context.t('commands:ERROR_PLAY_JOIN_CHANNEL'));
            await player.destroy();
            return null;
        }

        try {
            if (!player.dashboardMsg) {
                await client.dashboard.initialize(metadata, player);
            }
        } catch (error) {
            await client.dashboard.destroy(player);
        }

        // Set first user as DJ in dynamic mode (skip admins and if DJ-role user is in channel)
        if (bot.config.bot.djMode === DJModeEnum.DYNAMIC && !DJManager.hasDJSet(player)) {
            const djMember = context.isMessage()
                ? context.getMessage().member as GuildMember | null
                : context.getInteraction().member as GuildMember | null;
            const vc = djMember?.voice.channel;
            const isAdmin = bot.config.bot.admin.includes(context.user.id);
            const hasDJRoleUser = vc?.isVoiceBased() ? DJManager.hasDJRoleInChannel(bot, vc) : false;

            if (!isAdmin && !hasDJRoleUser) {
                DJManager.addDJ(player, context.user.id);
            }
        }

        return player;
    }
}
