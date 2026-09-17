import { BaseLavaSharkEvent } from './base/BaseLavaSharkEvent.js';
import { setVoiceChannelStatus } from '../../utils/functions/setVoiceStatus.js';
import { cleanTrackTitle } from '../../utils/functions/cleanTrackTitle.js';
import { isRadioTrack } from '../../utils/functions/isRadioTrack.js';

import type { Client } from 'discord.js';
import type { Player } from 'lavashark';
import type { Bot } from '../../@types/index.js';


/**
 * TrackStart event handler
 * Updates dashboard when a track starts playing
 */
export class TrackStartEvent extends BaseLavaSharkEvent<'trackStart'> {
    public getEventName(): 'trackStart' {
        return 'trackStart';
    }

    public async execute(bot: Bot, client: Client, player: Player): Promise<void> {
        // Cancel auto-leave timeout when a track starts
        if (player.autoLeaveTimeout) {
            clearTimeout(player.autoLeaveTimeout);
            player.autoLeaveTimeout = undefined;
        }

        const track = player.current;
        if (!track) return;

        // The first track after an empty queue starts a new listening session
        player.sessionStartedAt ??= Date.now();

        // Count the play before the dashboard reads the updated count
        if (!isRadioTrack(track)) {
            bot.playCountManager?.recordPlay(player.guildId, track.title, track.uri);
        }

        await client.dashboard.update(player, track);

        // Set voice channel status with track info
        if (track && player.voiceChannelId) {
            const emojis = bot.config.bot.voiceStatusEmojis;
            if (emojis.length > 0) {
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                const statusText = this.#formatVoiceStatus(track.author, track.title);
                await setVoiceChannelStatus(bot, client, player.voiceChannelId, `${emoji} ${statusText}`);
            }
        }

        // Save queue state and start periodic position saving
        if (bot.config.queuePersistence.enabled && client.queuePersistence) {
            await client.queuePersistence.saveQueue(player);
            client.queuePersistence.startPeriodicSave(player);
        }
    }

    /**
     * Format voice channel status text with author and title.
     * Shows "Author - Title" when the author is available and meaningful,
     * otherwise just the title. Truncates to fit voice status limits.
     */
    #formatVoiceStatus(author: string | undefined, title: string): string {
        const MAX_LENGTH = 80;

        const cleanedTitle = cleanTrackTitle(title);
        const cleanedAuthor = author ? cleanTrackTitle(author) : author;

        const hasAuthor = cleanedAuthor
            && cleanedAuthor.trim() !== ''
            && cleanedAuthor.toLowerCase() !== 'unknown'
            && cleanedAuthor.toLowerCase() !== cleanedTitle.toLowerCase();

        // Check if the title already starts with the author name followed by a separator
        const titleAlreadyHasAuthor = hasAuthor
            && cleanedTitle.toLowerCase().startsWith(cleanedAuthor!.toLowerCase())
            && /^.+\s*[-–—:]\s/.test(cleanedTitle);

        let statusText: string;

        if (hasAuthor && !titleAlreadyHasAuthor) {
            const combined = `${cleanedAuthor} - ${cleanedTitle}`;
            statusText = combined.length > MAX_LENGTH
                ? combined.substring(0, MAX_LENGTH - 3) + '...'
                : combined;
        }
        else {
            statusText = cleanedTitle.length > MAX_LENGTH
                ? cleanedTitle.substring(0, MAX_LENGTH - 3) + '...'
                : cleanedTitle;
        }

        return statusText;
    }
}
