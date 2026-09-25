import { ChatInputCommandInteraction, Message } from 'discord.js';

import { embeds } from '../embeds/index.js';
import { DJManager } from './DjManager.js';
import { DJModeEnum } from '../@types/index.js';
import { ButtonsBuilder } from './builders/ButtonsBuilder.js';
import { createProgressBar, PROGRESS_KNOB_FALLBACK, PROGRESS_KNOB_ID } from '../utils/functions/progressBar.js';

import type { Player, Track } from 'lavashark';
import type { Bot } from '../@types/index.js';
import type { Client, SendableChannels } from 'discord.js';


type DashboardTarget = ChatInputCommandInteraction | Message | SendableChannels;

/**
 * Dashboard embed content that stays unchanged between progress refreshes.
 */
interface DashboardSnapshot {
    status: string;
    title: string;
    subtitle: string;
    url: string;
    thumbnail: string;
}


/**
 * Dashboard management system for music playback control
 * Handles initialization, updates, and cleanup of dashboard messages
 */
export class DashboardManager {
    private static readonly PROGRESS_UPDATE_INTERVAL = 1_000;
    private static readonly FIELD_VALUE_LIMIT = 1024;

    readonly #bot: Bot;
    readonly #client: Client;
    readonly #updatePromises = new Map<string, Promise<void>>();
    readonly #progressTimers = new Map<string, ReturnType<typeof setInterval>>();
    readonly #snapshots = new Map<string, DashboardSnapshot>();
    readonly #progressFailures = new Set<string>();

    constructor(bot: Bot, client: Client) {
        this.#bot = bot;
        this.#client = client;
    }

    /**
     * Initialize dashboard in a channel.
     * Serialized with updates and destroys so no two dashboard messages
     * can ever be created for the same player at the same time.
     */
    public async initialize(
        target: DashboardTarget,
        player: Player
    ): Promise<void> {
        return this.#enqueue(
            player,
            () => this.#performInitialize(target, player),
        );
    }

    async #performInitialize(
        target: DashboardTarget,
        player: Player
    ): Promise<void> {
        let channel: SendableChannels | null;

        if (target instanceof Message) {
            channel = target.channel.isSendable() ? target.channel : null;
        }
        else if (target instanceof ChatInputCommandInteraction) {
            channel = target.channel?.isSendable() ? target.channel : null;
        }
        else {
            channel = target;
        }

        if (!channel) {
            throw new TypeError('Dashboard target does not have a sendable channel');
        }

        // A fresh dashboard has no track context yet: stop the previous
        // progress loop so a stale bar cannot edit the new message
        this.stopProgressUpdates(player.guildId);

        if (player.dashboardMsg) {
            try {
                await player.dashboardMsg.delete();
            } catch (_) {}
            player.dashboardMsg = null;
        }

        const lng = this.#bot.guildLanguageManager?.get(player.guildId);

        // Remove stale dashboards from earlier sessions (e.g. after a bot
        // restart the in-memory reference is gone) so only the new one stays
        const dashboardTitle = this.#bot.i18n.t('embeds:DASHBOARD_TITLE', { lng });
        try {
            if ('messages' in channel) {
                const messages = await channel.messages.fetch({ limit: 30 });
                for (const message of messages.values()) {
                    if (message.author.id === this.#client.user?.id &&
                        message.embeds.some((embed) => embed.title === dashboardTitle)) {
                        await message.delete().catch(() => {});
                    }
                }
            }
        } catch (_) {}

        player.dashboardMsg = await channel.send({
            embeds: [embeds.connected(this.#bot, lng)],
            components: []
        });
    }

    /**
     * Update dashboard with current track and player state (smart edit or re-send to bottom)
     */
    public async update(player: Player, track: Track): Promise<void> {
        return this.#enqueue(player, () => this.#performUpdate(player, track));
    }

    async #performUpdate(player: Player, track: Track): Promise<void> {
        const lng = this.#bot.guildLanguageManager?.get(player.guildId);
        const subtitle = await this.#buildSubtitle(player, track, lng);
        const buttons = ButtonsBuilder.createDashboardButtons(player, lng);

        const safeTitle = track.title.length > 256
            ? track.title.substring(0, 253) + '...'
            : track.title;
        const status = this.#bot.i18n.t('embeds:DASHBOARD_TITLE', { lng });
        const fieldValue = this.#composeFieldValue(this.#buildProgressLine(player, track), subtitle);

        const cachedChannel = player.textChannelId
            ? this.#client.channels.cache.get(player.textChannelId)
            : null;
        const dashboardChannel = player.dashboardMsg?.channel;
        const channel = (dashboardChannel?.isSendable() ? dashboardChannel : null) ??
            (cachedChannel?.isSendable() ? cachedChannel : null);

        if (!channel) {
            this.#bot.logger.error(this.#bot.shardId, 'Dashboard update called but channel is missing or invalid');
            return;
        }

        // Remember what a progress refresh must keep showing, then start the
        // per-second loop that only rewrites the progress line
        this.#snapshots.set(player.guildId, {
            status,
            title: safeTitle,
            subtitle,
            url: track.uri,
            thumbnail: track.thumbnail!
        });
        this.#startProgressUpdates(player);

        const embedPayload = {
            embeds: [embeds.dashboard(
                this.#bot,
                status,
                safeTitle,
                fieldValue,
                track.uri,
                track.thumbnail!
            )],
            components: [buttons]
        };

        if (player.dashboardMsg) {
            try {
                const lastMsgId = 'lastMessageId' in channel
                    ? channel.lastMessageId
                    : null;
                if (!lastMsgId || lastMsgId === player.dashboardMsg.id) {
                    await player.dashboardMsg.edit(embedPayload);
                    return;
                }
            } catch (_) {}

            // The dashboard is no longer the last message: move it to the
            // bottom. A replacement is only sent after the old one was
            // actually deleted, otherwise the message is refreshed in place
            // and no duplicate can ever appear.
            let deleted = false;
            try {
                await player.dashboardMsg.delete();
                deleted = true;
            } catch (_) {}

            if (!deleted) {
                try {
                    await player.dashboardMsg.edit(embedPayload);
                    return;
                } catch (_) {
                    // Message is gone: drop the reference and send a new one
                    player.dashboardMsg = null;
                }
            }
            else {
                player.dashboardMsg = null;
            }
        }

        try {
            player.dashboardMsg = await channel.send(embedPayload);
        } catch (error) {
            this.#bot.logger.error(this.#bot.shardId, 'Dashboard update error: ' + error);
        }
    }

    /**
     * Rewrite only the progress line of the dashboard message.
     * Runs on a timer and edits in place, so the dashboard never moves to the
     * bottom of the channel and never sends a duplicate message.
     */
    async #performProgressUpdate(player: Player): Promise<void> {
        const snapshot = this.#snapshots.get(player.guildId);
        const track = player.current;
        const dashboardMsg = player.dashboardMsg;

        if (!snapshot || !track || !dashboardMsg || !player.playing || player.paused) {
            return;
        }

        const fieldValue = this.#composeFieldValue(this.#buildProgressLine(player, track), snapshot.subtitle);

        try {
            await dashboardMsg.edit({
                embeds: [embeds.dashboard(
                    this.#bot,
                    snapshot.status,
                    snapshot.title,
                    fieldValue,
                    snapshot.url,
                    snapshot.thumbnail
                )],
                // The requester mention already exists in the embed; never ping again
                allowedMentions: { parse: [] }
            });
            this.#progressFailures.delete(player.guildId);
        } catch (error) {
            this.#handleProgressFailure(player, error);
        }
    }

    /**
     * Start the per-second progress refresh for a player.
     */
    #startProgressUpdates(player: Player): void {
        const guildId = player.guildId;
        if (this.#progressTimers.has(guildId)) {
            return;
        }

        const timer = setInterval(() => {
            // Never stack edits: skip when a dashboard operation is in flight
            if (this.#updatePromises.has(guildId)) {
                return;
            }

            void this.#enqueue(player, () => this.#performProgressUpdate(player));
        }, DashboardManager.PROGRESS_UPDATE_INTERVAL);

        this.#progressTimers.set(guildId, timer);
    }

    /**
     * Stop the progress refresh and forget the cached dashboard content.
     */
    public stopProgressUpdates(guildId: string): void {
        const timer = this.#progressTimers.get(guildId);
        if (timer) {
            clearInterval(timer);
            this.#progressTimers.delete(guildId);
        }

        this.#snapshots.delete(guildId);
        this.#progressFailures.delete(guildId);
    }

    /**
     * Stop every progress refresh, e.g. during shutdown.
     */
    public stopAllProgressUpdates(): void {
        for (const timer of this.#progressTimers.values()) {
            clearInterval(timer);
        }

        this.#progressTimers.clear();
        this.#snapshots.clear();
        this.#progressFailures.clear();
    }

    /**
     * Destroy dashboard and show disconnect message.
     * The message reference is kept so the next initialize() deletes it and
     * the next update() reuses it instead of leaving a stale duplicate.
     * Serialized with updates so a queued update can never race the destroy.
     */
    public async destroy(player: Player): Promise<void> {
        return this.#enqueue(player, () => this.#performDestroy(player));
    }

    async #performDestroy(player: Player): Promise<void> {
        this.stopProgressUpdates(player.guildId);

        if (!player.dashboardMsg) {
            return;
        }

        const lng = this.#bot.guildLanguageManager?.get(player.guildId);

        try {
            await player.dashboardMsg.edit({
                embeds: [embeds.disconnect(this.#bot, lng)],
                components: []
            });
        } catch (error) {
            this.#bot.logger.error( this.#bot.shardId, 'Dashboard destroy error: ' + error);
        }
    }

    /**
     * Serialize dashboard operations for one guild. Failures are logged and
     * do not poison later queued work or reject event-handler promises.
     */
    async #enqueue(
        player: Player,
        operation: () => Promise<void>,
    ): Promise<void> {
        const guildId = player.guildId;
        const previous = this.#updatePromises.get(guildId) ?? Promise.resolve();
        const current = previous.then(operation);
        const queueTail = current.catch((error) => {
            this.#bot.logger.error(
                this.#bot.shardId,
                `[DashboardManager] Operation failed for guild ${guildId}: ${error}`,
            );
        });
        this.#updatePromises.set(guildId, queueTail);

        try {
            await queueTail;
        } finally {
            if (this.#updatePromises.get(guildId) === queueTail) {
                this.#updatePromises.delete(guildId);
            }
        }
    }

    /**
     * Build the progress line: a live indicator for streams, otherwise the
     * bar with the playback spot and both timestamps.
     */
    #buildProgressLine(player: Player, track: Track): string {
        if (track.isStream || track.duration.value <= 0) {
            return '🔴 LIVE';
        }

        return createProgressBar(player.exactPosition, track.duration.value, this.#resolveKnob());
    }

    /**
     * Resolve the knob emoji, falling back to a plain emoji when the custom
     * one is not available to this client.
     */
    #resolveKnob(): string {
        const applicationEmoji = this.#client.application?.emojis.cache.get(PROGRESS_KNOB_ID);
        const guildEmoji = this.#client.emojis.cache.get(PROGRESS_KNOB_ID);
        const emoji = applicationEmoji ?? guildEmoji;

        return emoji ? emoji.toString() : PROGRESS_KNOB_FALLBACK;
    }

    /**
     * Join the progress line and subtitle within the embed field value limit.
     */
    #composeFieldValue(progress: string, subtitle: string): string {
        const maxSubtitleLength = DashboardManager.FIELD_VALUE_LIMIT - progress.length - 1;
        const trimmedSubtitle = subtitle.length > maxSubtitleLength
            ? subtitle.substring(0, Math.max(0, maxSubtitleLength - 3)) + '...'
            : subtitle;

        return `${progress}\n${trimmedSubtitle}`;
    }

    /**
     * Keep the progress loop alive after a transient edit failure, but stop it
     * when the dashboard message or its channel no longer exists.
     */
    #handleProgressFailure(player: Player, error: unknown): void {
        const code = error instanceof Error && 'code' in error ? error.code : null;
        if (code === 10008 || code === 10003) {
            player.dashboardMsg = null;
            this.stopProgressUpdates(player.guildId);
            return;
        }

        // Log only once per guild until an update succeeds again
        if (!this.#progressFailures.has(player.guildId)) {
            this.#progressFailures.add(player.guildId);
            this.#bot.logger.error(
                this.#bot.shardId,
                `[DashboardManager] Progress update failed for guild ${player.guildId}: ${error}`
            );
        }
    }

    /**
     * Build subtitle with track info, volume, repeat mode, and DJ info
     */
    async #buildSubtitle(player: Player, track: Track, lng?: string): Promise<string> {
        const repeatModeLabel = this.#getRepeatModeLabel(player.repeatMode, lng);

        const currentVolume = player.volume ??
            player.setting?.volume ??
            this.#bot.guildVolumeManager?.get(player.guildId) ??
            this.#bot.config.bot.volume.default;

        let subtitle = this.#bot.i18n.t('embeds:DASHBOARD_SUBTITLE', {
            author: track.author,
            duration: track.duration.label,
            volume: currentVolume,
            repeatMode: repeatModeLabel,
            lng
        });

        // Add how many times this song has been played in this guild
        const playCount = this.#bot.playCountManager?.getCount(player.guildId, track.title, track.uri) ?? 0;
        if (playCount > 0) {
            subtitle += this.#bot.i18n.t('embeds:DASHBOARD_PLAY_COUNT', { count: playCount, lng });
        }

        // Add requester info
        const requesterId = track.requester?.id;
        if (requesterId) {
            subtitle += this.#bot.i18n.t('embeds:DASHBOARD_REQUESTER_INFO', { requesterId, lng });
        }

        // Add Dynamic DJ info (only if DYNAMIC mode AND a DJ is assigned)
        if (this.#bot.config.bot.djMode === DJModeEnum.DYNAMIC && player.djUsers && player.djUsers.size > 0) {
            try {
                const guild = this.#client.guilds.cache.get(player.guildId);
                const djDisplay = await DJManager.getDJDisplayString(this.#bot, this.#client, guild, player);
                subtitle += this.#bot.i18n.t('embeds:DASHBOARD_DJ_INFO', { djDisplay, lng });
            } catch (_) {
                // Ignore errors in DJ display
            }
        }

        return subtitle;
    }

    /**
     * Get repeat mode label for display
     */
    #getRepeatModeLabel(repeatMode: number, lng?: string): string {
        const methods = [
            this.#bot.i18n.t('commands:REPEAT_MODE_OFF', { lng }),
            this.#bot.i18n.t('commands:REPEAT_MODE_SINGLE', { lng }),
            this.#bot.i18n.t('commands:REPEAT_MODE_ALL', { lng })
        ];
        return methods[repeatMode] || methods[0];
    }
}
