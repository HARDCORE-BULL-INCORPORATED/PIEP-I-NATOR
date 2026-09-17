import { EmbedBuilder, HexColorString } from 'discord.js';

import { CommandCategory } from '../@types/index.js';

import type { Bot } from '../@types/index.js';


/** Discord's maximum length for a single embed field value */
const EMBED_FIELD_VALUE_LIMIT = 1024;


/**
 * One category of the help overview with its formatted command lines
 */
interface HelpListSection {
    category: CommandCategory;
    lines: string[];
}

/**
 * Split command lines into chunks that fit into a single embed field value.
 * Truncates a single line that is longer than the limit.
 */
const chunkLines = (lines: string[], maxLength: number): string[] => {
    const chunks: string[] = [];
    let chunk = '';

    for (const line of lines) {
        const normalizedLine = line.length > maxLength
            ? line.slice(0, maxLength - 3) + '...'
            : line;
        const candidate = chunk.length > 0 ? `${chunk}\n${normalizedLine}` : normalizedLine;

        if (chunk.length > 0 && candidate.length > maxLength) {
            chunks.push(chunk);
            chunk = normalizedLine;
        }
        else {
            chunk = candidate;
        }
    }

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
};

const filterMsg = (bot: Bot, effectName: string, lng?: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setDescription(bot.i18n.t('embeds:MESSAGE_FILTER', { effectName: effectName, lng }));

    return embed_;
};

const help = (bot: Bot, command: string, description: string, lng?: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_COMMAND', { command: command, lng }))
        .setDescription(description);

    return embed_;
};

const helpList = (
    bot: Bot,
    sections: HelpListSection[],
    lng?: string,
) => {
    const fields = sections.flatMap((section) => {
        const label = bot.i18n.t(
            section.category === CommandCategory.MUSIC
                ? 'embeds:MESSAGE_HELP_MUSIC'
                : 'embeds:MESSAGE_HELP_UTILITY',
            { lng }
        );
        const chunks = chunkLines(section.lines, EMBED_FIELD_VALUE_LIMIT);

        return chunks.map((value, index) => ({
            name: chunks.length > 1 ? `${label} (${index + 1}/${chunks.length})` : label,
            value
        }));
    });

    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(bot.i18n.t('embeds:MESSAGE_HELP_TITLE', { lng }))
        .setDescription(bot.i18n.t('embeds:MESSAGE_HELP_DESCRIPTION', { prefix: bot.config.bot.prefix, lng }))
        .addFields(fields);

    return embed_;
};

const textMsg = (bot: Bot, message: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setDescription(message);

    return embed_;
};

const textErrorMsg = (bot: Bot, message: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.error as HexColorString | number)
        .setDescription(message);

    return embed_;
};

const textSuccessMsg = (bot: Bot, message: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.success as HexColorString | number)
        .setDescription(message);

    return embed_;
};

const textWarningMsg = (bot: Bot, message: string) => {
    const embed_ = new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.warning as HexColorString | number)
        .setDescription(message);

    return embed_;
};

export { filterMsg, help, helpList, textMsg, textErrorMsg, textSuccessMsg, textWarningMsg };
