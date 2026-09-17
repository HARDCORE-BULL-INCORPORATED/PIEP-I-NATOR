import { EmbedBuilder } from 'discord.js';

import type { HexColorString } from 'discord.js';
import type { Bot, TrackPlayCount } from '../@types/index.js';


const mostPlayed = (
    bot: Bot,
    entries: TrackPlayCount[],
    lng?: string,
): EmbedBuilder => {
    const lines = entries.map((entry, index) =>
        bot.i18n.t('embeds:MESSAGE_MOST_PLAYED_ENTRY', {
            index: index + 1,
            title: entry.title,
            url: entry.url,
            count: entry.count,
            lng
        })
    );

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_MOST_PLAYED_TITLE', { lng }))
        .setDescription(lines.join('\n'))
        .setTimestamp();
};

export { mostPlayed };
