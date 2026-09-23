import { EmbedBuilder, HexColorString } from 'discord.js';

import { getFiltersByCategory } from '../utils/filters/index.js';
import { EQ_BAND_FREQUENCIES } from '../utils/filters/presets.js';
import { chunkLines } from '../utils/functions/chunkLines.js';

import type { Bot, FilterCategory, FilterDefinition } from '../@types/index.js';


/** Discord's maximum length for a single embed field value */
const EMBED_FIELD_VALUE_LIMIT = 1024;

/** Short labels for the channel mix factors */
const CHANNEL_MIX_LABELS: Record<string, string> = {
    leftToLeft: 'L→L',
    leftToRight: 'L→R',
    rightToLeft: 'R→L',
    rightToRight: 'R→R',
};

const categoryLabel = (bot: Bot, category: FilterCategory, lng?: string): string => {
    return bot.i18n.t(`commands:MESSAGE_FILTER_CATEGORY_${category.toUpperCase()}`, { lng }) as string;
};

/**
 * Format numeric filter options as "key value" pairs joined by a separator
 */
const formatOptionValues = (options: Record<string, unknown>, labels?: Record<string, string>): string => {
    return Object.entries(options)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => `${labels?.[key] ?? key} ${value}`)
        .join(' · ');
};

/**
 * Format the Lavalink filter payload of a filter as human readable lines
 */
const formatTechnicalDetails = (filter: FilterDefinition): string => {
    const lines: string[] = [];
    const { options } = filter;

    if (options.equalizer) {
        const bands = options.equalizer
            .map((gain, band) => ({ gain, band }))
            .filter(({ gain }) => gain !== 0)
            .map(({ gain, band }) => `${EQ_BAND_FREQUENCIES[band]} ${gain > 0 ? '+' : ''}${gain}`);

        if (bands.length > 0) {
            lines.push(`**Equalizer**: ${bands.join(' · ')}`);
        }
    }

    if (options.timescale) {
        lines.push(`**Timescale**: ${formatOptionValues(options.timescale)}`);
    }

    if (options.lowPass?.smoothing !== undefined) {
        lines.push(`**Low Pass**: smoothing ${options.lowPass.smoothing}`);
    }

    if (options.tremolo) {
        lines.push(`**Tremolo**: ${formatOptionValues(options.tremolo)}`);
    }

    if (options.vibrato) {
        lines.push(`**Vibrato**: ${formatOptionValues(options.vibrato)}`);
    }

    if (options.rotation?.rotationHz !== undefined) {
        lines.push(`**Rotation**: ${options.rotation.rotationHz} Hz`);
    }

    if (options.distortion) {
        lines.push(`**Distortion**: ${formatOptionValues(options.distortion)}`);
    }

    if (options.channelMix) {
        lines.push(`**Channel Mix**: ${formatOptionValues(options.channelMix, CHANNEL_MIX_LABELS)}`);
    }

    if (options.karaoke) {
        const { level, monoLevel, filterBand, filterWidth } = options.karaoke;
        const parts = [
            level !== undefined ? `level ${level}` : null,
            monoLevel !== undefined ? `monoLevel ${monoLevel}` : null,
            filterBand !== undefined ? `band ${filterBand} Hz` : null,
            filterWidth !== undefined ? `width ${filterWidth}` : null,
        ].filter((part): part is string => part !== null);

        lines.push(`**Karaoke**: ${parts.join(' · ')}`);
    }

    return lines.join('\n');
};

/**
 * Build the filter overview embed of a category
 */
const filterList = (bot: Bot, category: FilterCategory, lng?: string) => {
    const filters = getFiltersByCategory(category);
    const label = categoryLabel(bot, category, lng);
    const lines = filters.map((filter) => `**${filter.label}** — ${filter.description}`);
    const chunks = chunkLines(lines, EMBED_FIELD_VALUE_LIMIT);

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(`${label} (${filters.length})`)
        .setDescription(bot.i18n.t('embeds:MESSAGE_FILTERS_LIST_DESCRIPTION', { prefix: bot.config.bot.prefix, lng }))
        .addFields(chunks.map((value, index) => ({
            name: chunks.length > 1 ? `${label} (${index + 1}/${chunks.length})` : label,
            value,
        })));
};

/**
 * Build the technical detail embed of a single filter
 */
const filterDetail = (bot: Bot, filter: FilterDefinition, lng?: string) => {
    const aliases = filter.aliases.length > 0
        ? filter.aliases.map((alias) => `\`${alias}\``).join(', ')
        : '—';

    return new EmbedBuilder()
        .setColor(bot.config.bot.embedsColors.message as HexColorString | number)
        .setTitle(filter.label)
        .setDescription(filter.description)
        .addFields(
            {
                name: bot.i18n.t('embeds:MESSAGE_FILTERS_DETAIL_CATEGORY', { lng }) as string,
                value: categoryLabel(bot, filter.category, lng),
                inline: true,
            },
            {
                name: bot.i18n.t('embeds:MESSAGE_FILTERS_DETAIL_ALIASES', { lng }) as string,
                value: aliases,
                inline: true,
            },
            {
                name: bot.i18n.t('embeds:MESSAGE_FILTERS_DETAIL_APPLY', { lng }) as string,
                value: `\`${bot.config.bot.prefix}filter ${filter.name}\``,
            },
            {
                name: bot.i18n.t('embeds:MESSAGE_FILTERS_DETAIL_TECHNICAL', { lng }) as string,
                value: formatTechnicalDetails(filter),
            },
        );
};

export { filterList, filterDetail };
