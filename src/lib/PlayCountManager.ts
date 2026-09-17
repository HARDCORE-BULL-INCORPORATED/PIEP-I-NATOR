import { cleanTrackTitle } from '../utils/functions/cleanTrackTitle.js';
import { normalizeTrackUrl } from '../utils/functions/normalizeTrackUrl.js';

import type { Bot, TrackPlayCount } from '../@types/index.js';


/**
 * Tracks how many times each song has been played per guild.
 * Keys are normalized so link and title variants of the same video share one row.
 */
export class PlayCountManager {
    private readonly bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    /**
     * Increment the play count of a track in a guild.
     * Fails silently (with a logged error) when the database is unavailable.
     */
    public recordPlay(guildId: string, title: string, url: string): void {
        const normalizedTitle = cleanTrackTitle(title);
        const normalizedUrl = normalizeTrackUrl(url);

        try {
            this.bot.databaseManager?.executeTransaction(
                (db, guild: string, trackTitle: string, trackUrl: string) => {
                    db.prepare(`
                        INSERT INTO track_play_counts (guild_id, title, url, count)
                        VALUES (?, ?, ?, 1)
                        ON CONFLICT(guild_id, title, url) DO UPDATE SET count = count + 1
                    `).run(guild, trackTitle, trackUrl);
                },
                guildId,
                normalizedTitle,
                normalizedUrl
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
                SELECT title, url, count
                FROM track_play_counts
                WHERE guild_id = ?
                ORDER BY count DESC, title ASC
                LIMIT ?
            `).all(guildId, limit) as TrackPlayCount[];

            return rows;
        } catch (error) {
            this.bot.logger.error(this.bot.shardId, `[PlayCountManager] Failed to read most played tracks for guild ${guildId}: ${error}`);
            return [];
        }
    }
}
