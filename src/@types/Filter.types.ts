import type { FilterOptions } from 'lavashark/typings/src/@types/index.js';


/**
 * Filter category used to group filters in the interactive selection menu
 */
export enum FilterCategory {
    BASS = 'bass',
    SPEED = 'speed',
    ELECTRONIC = 'electronic',
    GENRE = 'genre',
    EFFECT = 'effect',
}

/**
 * A single music filter of the catalog
 */
export interface FilterDefinition {
    /** Canonical lowercase name used by commands and select menus */
    name: string;
    /** Human readable name shown in menus and replies */
    label: string;
    /** Alternative names accepted by commands and autocomplete */
    aliases: string[];
    /** Category the filter belongs to */
    category: FilterCategory;
    /** Lavalink filter payload applied through player.filters.set() */
    options: FilterOptions;
}
