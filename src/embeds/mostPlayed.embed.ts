import { EmbedBuilder } from 'discord.js';

import type { HexColorString } from 'discord.js';
import type { Bot, TrackPlayCount } from '../@types/index.js';


const mostPlayed = (
    bot: Bot,
    entries: TrackPlayCount[],
    totalPlays: number,
    lng?: string,
): EmbedBuilder => {
    const formattedTotal = new Intl.NumberFormat(lng ?? bot.config.bot.i18n.defaultLocale).format(totalPlays);

    const lines = entries.map((entry, index) => {
        // Songs counted before play timestamps existed have no last-played date
        const hasLastPlayed = entry.lastPlayedAt > 0;
        const template = hasLastPlayed
            ? 'embeds:MESSAGE_MOST_PLAYED_ENTRY_WITH_TIME'
            : 'embeds:MESSAGE_MOST_PLAYED_ENTRY';

        return bot.i18n.t(template, {
            index: index + 1,
            title: entry.title,
            url: entry.url,
            count: entry.count,
            time: hasLastPlayed ? `<t:${Math.floor(entry.lastPlayedAt / 1000)}:R>` : '',
            lng,
        });
    });

    const description = [
        bot.i18n.t('embeds:MESSAGE_MOST_PLAYED_TOTAL', { total: formattedTotal, lng }),
        '',
        ...lines,
    ].join('\n');

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_MOST_PLAYED_TITLE', { lng }))
        .setDescription(description)
        .setTimestamp();
};

export { mostPlayed };
