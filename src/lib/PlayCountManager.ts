import { cleanTrackTitle } from '../utils/functions/cleanTrackTitle.js';
import { normalizeTrackUrl } from '../utils/functions/normalizeTrackUrl.js';

import type { Bot, TrackPlayCount, TrackPlayEvent } from '../@types/index.js';


/**
 * Tracks how many times each song has been played per guild and keeps a
 * timestamped history of every play.
 * Keys are normalized so link and title variants of the same video share one row.
 */
export class PlayCountManager {
    private readonly bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    /**
     * Record a play: append a history entry and increment the play count in one transaction.
     * Fails silently (with a logged error) when the database is unavailable.
     */
    public recordPlay(guildId: string, title: string, url: string): void {
        const normalizedTitle = cleanTrackTitle(title);
        const normalizedUrl = normalizeTrackUrl(url);
        const playedAt = Date.now();

        try {
            this.bot.databaseManager?.executeTransaction(
                (db, guild: string, trackTitle: string, trackUrl: string, timestamp: number) => {
                    db.prepare(`
                        INSERT INTO track_play_history (guild_id, title, url, played_at)
                        VALUES (?, ?, ?, ?)
                    `).run(guild, trackTitle, trackUrl, timestamp);

                    db.prepare(`
                        INSERT INTO track_play_counts (guild_id, title, url, count, last_played_at)
                        VALUES (?, ?, ?, 1, ?)
                        ON CONFLICT(guild_id, title, url) DO UPDATE SET
                            count = count + 1,
                            last_played_at = excluded.last_played_at
                    `).run(guild, trackTitle, trackUrl, timestamp);
                },
                guildId,
                normalizedTitle,
                normalizedUrl,
                playedAt
            );
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to record play for guild ${guildId}: ${error}`);
        }
    }

    /**
     * Get how many times a track has been played in a guild.
     * Returns 0 when the track has no plays or the database is unavailable.
     */
    public getCount(guildId: string, title: string, url: string): number {
        const db = this.bot.databaseManager?.getDatabase();
        if (!db) {
            return 0;
        }

        try {
            const row = db.prepare(`
                SELECT count
                FROM track_play_counts
                WHERE guild_id = ? AND title = ? AND url = ?
            `).get(guildId, cleanTrackTitle(title), normalizeTrackUrl(url)) as { count: number } | null;

            return row?.count ?? 0;
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to read play count for guild ${guildId}: ${error}`);
            return 0;
        }
    }

    /**
     * Get the total number of plays recorded in a guild.
     * Returns 0 when the database is unavailable.
     */
    public getTotalPlays(guildId: string): number {
        const db = this.bot.databaseManager?.getDatabase();
        if (!db) {
            return 0;
        }

        try {
            const row = db.prepare(`
                SELECT COALESCE(SUM(count), 0) AS total
                FROM track_play_counts
                WHERE guild_id = ?
            `).get(guildId) as { total: number } | null;

            return row?.total ?? 0;
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to read total plays for guild ${guildId}: ${error}`);
            return 0;
        }
    }

    /**
     * Get the most played tracks of a guild, highest count first.
     * Returns an empty list when the database is unavailable.
     */
    public getMostPlayed(guildId: string, limit: number): TrackPlayCount[] {
        const db = this.bot.databaseManager?.getDatabase();
        if (!db) {
            return [];
        }

        try {
            const rows = db.prepare(`
                SELECT title, url, count, last_played_at
                FROM track_play_counts
                WHERE guild_id = ?
                ORDER BY count DESC, title ASC
                LIMIT ?
            `).all(guildId, limit) as Array<{ title: string; url: string; count: number; last_played_at: number }>;

            return rows.map((row) => ({
                title: row.title,
                url: row.url,
                count: row.count,
                lastPlayedAt: row.last_played_at
            }));
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to read most played tracks for guild ${guildId}: ${error}`);
            return [];
        }
    }

    /**
     * Count history entries of a guild that happened at or before the given timestamp.
     * Returns 0 when the database is unavailable.
     */
    public getPlayHistoryCount(guildId: string, before: number): number {
        const db = this.bot.databaseManager?.getDatabase();
        if (!db) {
            return 0;
        }

        try {
            const row = db.prepare(`
                SELECT COUNT(*) AS total
                FROM track_play_history
                WHERE guild_id = ? AND played_at <= ?
            `).get(guildId, before) as { total: number } | null;

            return row?.total ?? 0;
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to count play history for guild ${guildId}: ${error}`);
            return 0;
        }
    }

    /**
     * Get one page of a guild's play history, newest first.
     * The `before` timestamp freezes the history so pages stay stable while new tracks start.
     * Returns an empty list when the database is unavailable.
     */
    public getPlayHistoryPage(guildId: string, limit: number, offset: number, before: number): TrackPlayEvent[] {
        const db = this.bot.databaseManager?.getDatabase();
        if (!db) {
            return [];
        }

        try {
            const rows = db.prepare(`
                SELECT title, url, played_at
                FROM track_play_history
                WHERE guild_id = ? AND played_at <= ?
                ORDER BY played_at DESC, id DESC
                LIMIT ? OFFSET ?
            `).all(guildId, before, limit, offset) as Array<{ title: string; url: string; played_at: number }>;

            return rows.map((row) => ({
                title: row.title,
                url: row.url,
                playedAt: row.played_at
            }));
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to read play history for guild ${guildId}: ${error}`);
            return [];
        }
    }
}
