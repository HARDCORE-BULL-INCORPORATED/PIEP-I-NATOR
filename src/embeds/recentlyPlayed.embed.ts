import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    escapeMarkdown,
} from 'discord.js';

import { RecentlyPlayedButtonId } from '../@types/index.js';
import { cst } from '../utils/constants.js';

import type { HexColorString } from 'discord.js';
import type { Bot, TrackPlayEvent } from '../@types/index.js';


const RECENTLY_PLAYED_PAGE_SIZE = 20;
const MAX_TRACK_TITLE_LENGTH = 80;

const sanitizeTrackTitle = (title: string, maxLength: number): string => {
    const shortenedTitle = title.length > maxLength
        ? `${title.slice(0, maxLength - 1)}…`
        : title;
    return escapeMarkdown(shortenedTitle);
};

const sanitizeTrackUrl = (url: string): string => {
    return url.replaceAll(')', '%29');
};

/**
 * Build the recently played embed for one page of play history.
 * @param offset - Zero-based index of the first entry on this page, used for continuous numbering
 */
const recentlyPlayed = (
    bot: Bot,
    events: TrackPlayEvent[],
    offset: number,
    page: number,
    totalPages: number,
    lng?: string,
): EmbedBuilder => {
    const buildDescription = (maxTitleLength: number): string => {
        return events.map((event, index) => {
            const time = `<t:${Math.floor(event.playedAt / 1000)}:R>`;
            return bot.i18n.t('embeds:MESSAGE_RECENTLY_PLAYED_ENTRY', {
                index: offset + index + 1,
                title: sanitizeTrackTitle(event.title, maxTitleLength),
                url: sanitizeTrackUrl(event.url),
                time,
                lng,
            });
        }).join('\n');
    };

    let maxTitleLength = MAX_TRACK_TITLE_LENGTH;
    let description = buildDescription(maxTitleLength);

    // Shorten titles if the page exceeds Discord's description limit
    while (description.length > 4000 && maxTitleLength > 10) {
        maxTitleLength -= 10;
        description = buildDescription(maxTitleLength);
    }

    if (description.length > 4096) {
        description = description.substring(0, 4093) + '...';
    }

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_RECENTLY_PLAYED_TITLE', { lng }))
        .setDescription(description)
        .setFooter({
            text: bot.i18n.t('commands:MESSAGE_FOOTER_PAGE', {
                page,
                totalPages,
                lng,
            }),
        })
        .setTimestamp();
};

/**
 * Build the previous/next pagination buttons for the recently played list.
 */
const recentlyPlayedButtons = (
    page: number,
    totalPages: number,
    disabled = false,
): ActionRowBuilder<ButtonBuilder> => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(RecentlyPlayedButtonId.Previous)
            .setEmoji(cst.button.emoji.prev)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled || page <= 1),
        new ButtonBuilder()
            .setCustomId(RecentlyPlayedButtonId.Next)
            .setEmoji(cst.button.emoji.next)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled || page >= totalPages),
    );
};

export { RECENTLY_PLAYED_PAGE_SIZE, recentlyPlayed, recentlyPlayedButtons };
