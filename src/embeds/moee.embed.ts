import { EmbedBuilder } from 'discord.js';

import type { HexColorString } from 'discord.js';
import type { Bot } from '../@types/index.js';


/**
 * Build the listening stats embed for the current session and the last 24 hours.
 */
const moee = (
    bot: Bot,
    sessionCount: number,
    dailyCount: number,
    lng?: string,
): EmbedBuilder => {
    const numberFormat = new Intl.NumberFormat(lng ?? bot.config.bot.i18n.defaultLocale);

    const buildField = (nameKey: string, count: number) => ({
        name: bot.i18n.t(nameKey, { lng }),
        value: bot.i18n.t('embeds:MESSAGE_MOEE_FIELD_VALUE', {
            count: numberFormat.format(count),
            lng,
        }),
        inline: true,
    });

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_MOEE_TITLE', { lng }))
        .addFields(
            buildField('embeds:MESSAGE_MOEE_SESSION_FIELD', sessionCount),
            buildField('embeds:MESSAGE_MOEE_24H_FIELD', dailyCount),
        )
        .setTimestamp();
};

export { moee };
