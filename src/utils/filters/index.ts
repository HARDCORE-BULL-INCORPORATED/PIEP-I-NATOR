import { FilterCategory } from '../../@types/index.js';
import { BASS_FILTERS } from './bassFilters.js';
import { EFFECT_FILTERS } from './effectFilters.js';
import { ELECTRONIC_FILTERS } from './electronicFilters.js';
import { GENRE_FILTERS } from './genreFilters.js';
import { SPEED_FILTERS } from './speedFilters.js';
import { EQ_BAND_COUNT } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/** Category display order used by the interactive selection menu */
export const FILTER_CATEGORIES: readonly FilterCategory[] = [
    FilterCategory.BASS,
    FilterCategory.SPEED,
    FilterCategory.ELECTRONIC,
    FilterCategory.GENRE,
    FilterCategory.EFFECT,
];

/** All available music filters */
export const FILTERS: readonly FilterDefinition[] = [
    ...BASS_FILTERS,
    ...SPEED_FILTERS,
    ...ELECTRONIC_FILTERS,
    ...GENRE_FILTERS,
    ...EFFECT_FILTERS,
];

/** Normalized name and alias lookup table */
const FILTER_INDEX = new Map<string, FilterDefinition>();

/**
 * Normalize a filter name or alias for case and separator insensitive lookup
 */
const normalizeFilterKey = (value: string): string => value.toLowerCase().replace(/[\s\-_]/g, '');

/**
 * Validate a filter against the Lavalink filter bounds
 * @throws {RangeError} When a filter option is outside the supported bounds
 */
const validateDefinition = (filter: FilterDefinition): void => {
    const { options } = filter;
    const optionKeys = Object.keys(options).filter((key) => key !== 'volume');

    if (optionKeys.length === 0) {
        throw new RangeError(`Filter "${filter.name}" must define at least one filter option`);
    }

    if (options.equalizer) {
        if (options.equalizer.length !== EQ_BAND_COUNT) {
            throw new RangeError(`Filter "${filter.name}" equalizer must have ${EQ_BAND_COUNT} bands, got ${options.equalizer.length}`);
        }

        for (const [band, gain] of options.equalizer.entries()) {
            if (gain < -0.25 || gain > 1) {
                throw new RangeError(`Filter "${filter.name}" equalizer band ${band} gain must be between -0.25 and 1, got ${gain}`);
            }
        }
    }

    if (options.lowPass?.smoothing !== undefined && options.lowPass.smoothing <= 1) {
        throw new RangeError(`Filter "${filter.name}" lowPass smoothing must be greater than 1, got ${options.lowPass.smoothing}`);
    }

    if (options.tremolo) {
        if (options.tremolo.frequency !== undefined && (options.tremolo.frequency <= 0 || options.tremolo.frequency > 14)) {
            throw new RangeError(`Filter "${filter.name}" tremolo frequency must be between 0 and 14, got ${options.tremolo.frequency}`);
        }
        if (options.tremolo.depth !== undefined && (options.tremolo.depth <= 0 || options.tremolo.depth > 1)) {
            throw new RangeError(`Filter "${filter.name}" tremolo depth must be between 0 and 1, got ${options.tremolo.depth}`);
        }
    }

    if (options.vibrato) {
        if (options.vibrato.frequency !== undefined && (options.vibrato.frequency <= 0 || options.vibrato.frequency > 14)) {
            throw new RangeError(`Filter "${filter.name}" vibrato frequency must be between 0 and 14, got ${options.vibrato.frequency}`);
        }
        if (options.vibrato.depth !== undefined && (options.vibrato.depth <= 0 || options.vibrato.depth > 1)) {
            throw new RangeError(`Filter "${filter.name}" vibrato depth must be between 0 and 1, got ${options.vibrato.depth}`);
        }
    }

    if (options.timescale) {
        for (const [key, value] of Object.entries(options.timescale)) {
            if (value !== undefined && value <= 0) {
                throw new RangeError(`Filter "${filter.name}" timescale ${key} must be greater than 0, got ${value}`);
            }
        }
    }

    if (options.rotation?.rotationHz !== undefined && options.rotation.rotationHz <= 0) {
        throw new RangeError(`Filter "${filter.name}" rotationHz must be greater than 0, got ${options.rotation.rotationHz}`);
    }

    if (options.channelMix) {
        for (const [key, value] of Object.entries(options.channelMix)) {
            if (value !== undefined && (value < 0 || value > 1)) {
                throw new RangeError(`Filter "${filter.name}" channelMix ${key} must be between 0 and 1, got ${value}`);
            }
        }
    }

    if (options.karaoke) {
        for (const key of ['level', 'monoLevel'] as const) {
            const value = options.karaoke[key];

            if (value !== undefined && (value < 0 || value > 1)) {
                throw new RangeError(`Filter "${filter.name}" karaoke ${key} must be between 0 and 1, got ${value}`);
            }
        }

        for (const key of ['filterBand', 'filterWidth'] as const) {
            const value = options.karaoke[key];

            if (value !== undefined && value <= 0) {
                throw new RangeError(`Filter "${filter.name}" karaoke ${key} must be greater than 0, got ${value}`);
            }
        }
    }

    if (options.distortion) {
        for (const [key, value] of Object.entries(options.distortion)) {
            if (value !== undefined && !Number.isFinite(value)) {
                throw new RangeError(`Filter "${filter.name}" distortion ${key} must be a finite number, got ${value}`);
            }
        }
    }
};

/**
 * Build the lookup table and fail fast on an invalid or duplicated filter
 */
const registerFilters = (): void => {
    for (const filter of FILTERS) {
        validateDefinition(filter);

        for (const key of [filter.name, ...filter.aliases]) {
            const normalizedKey = normalizeFilterKey(key);
            const existing = FILTER_INDEX.get(normalizedKey);

            if (existing) {
                throw new Error(`Filter name or alias "${key}" of "${filter.name}" is already used by "${existing.name}"`);
            }

            FILTER_INDEX.set(normalizedKey, filter);
        }
    }
};

/**
 * Score how well a filter matches an autocomplete query
 */
const matchScore = (filter: FilterDefinition, query: string): number => {
    const name = normalizeFilterKey(filter.name);

    if (name.startsWith(query)) return 3;
    if (filter.aliases.some((alias) => normalizeFilterKey(alias).startsWith(query))) return 2;
    if (name.includes(query)) return 1;
    if (filter.aliases.some((alias) => normalizeFilterKey(alias).includes(query))) return 1;

    return 0;
};

registerFilters();

/**
 * Resolve a filter by name or alias, ignoring case and separators
 * @param input - Filter name or alias
 * @returns The matching filter or null when the input is unknown
 */
export const resolveFilter = (input: string): FilterDefinition | null => {
    return FILTER_INDEX.get(normalizeFilterKey(input)) ?? null;
};

/**
 * Get all filters of a category in catalog order
 * @param category - Filter category
 */
export const getFiltersByCategory = (category: FilterCategory): FilterDefinition[] => {
    return FILTERS.filter((filter) => filter.category === category);
};

/**
 * Suggest filters for an autocomplete query, best matches first
 * @param partial - Current autocomplete input
 * @param limit - Maximum number of suggestions
 */
export const suggestFilters = (partial: string, limit = 25): FilterDefinition[] => {
    const query = normalizeFilterKey(partial);

    if (!query) {
        return FILTERS.slice(0, limit);
    }

    return FILTERS
        .map((filter) => ({ filter, score: matchScore(filter, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ filter }) => filter);
};
