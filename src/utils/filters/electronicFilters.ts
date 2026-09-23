import { FilterCategory } from '../../@types/index.js';
import { DISTORTION_HARD, DISTORTION_SOFT, eqBands } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/**
 * Electronic and club filters
 */
export const ELECTRONIC_FILTERS: FilterDefinition[] = [
    {
        name: 'techno',
        label: 'Techno',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.1, 9: 0.1, 10: 0.2, 11: 0.25, 12: 0.2, 13: 0.1 }),
        },
    },
    {
        name: 'house',
        label: 'House',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1, 9: 0.15, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'trance',
        label: 'Trance',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.35, 1: 0.3, 2: 0.25, 3: 0.15, 4: 0.1, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
        },
    },
    {
        name: 'edm',
        label: 'EDM',
        aliases: ['dance'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'dubstep',
        label: 'Dubstep',
        aliases: ['dub'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.85, 1: 0.75, 2: 0.6, 3: 0.45, 4: 0.25, 5: 0.05, 6: -0.1, 7: -0.15, 8: -0.1, 10: 0.1, 11: 0.15 }),
            distortion: DISTORTION_SOFT,
            tremolo: { frequency: 4, depth: 0.3 },
        },
    },
    {
        name: 'drumandbass',
        label: 'Drum & Bass',
        aliases: ['dnb', 'd&b'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.7, 1: 0.6, 2: 0.45, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
            timescale: { speed: 1.1 },
        },
    },
    {
        name: 'hardstyle',
        label: 'Hardstyle',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.8, 1: 0.7, 2: 0.55, 3: 0.4, 4: 0.2, 5: 0.05, 6: -0.05, 7: -0.1, 9: 0.1, 10: 0.2, 11: 0.2 }),
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'hardcore',
        label: 'Hardcore',
        aliases: ['hc'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.85, 1: 0.75, 2: 0.6, 3: 0.45, 4: 0.25, 5: 0.05, 6: -0.1, 7: -0.15, 10: 0.15, 11: 0.2, 12: 0.15 }),
            distortion: DISTORTION_HARD,
            timescale: { speed: 1.2 },
        },
    },
    {
        name: 'rave',
        label: 'Rave',
        aliases: ['raving'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3 }),
            rotation: { rotationHz: 0.3 },
        },
    },
    {
        name: 'synthwave',
        label: 'Synthwave',
        aliases: ['outrun'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.2, 4: 0.1, 8: 0.1, 9: 0.2, 10: 0.3, 11: 0.3, 12: 0.25, 13: 0.15 }),
            timescale: { pitch: 0.95 },
        },
    },
    {
        name: 'phonk',
        label: 'Phonk',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.85, 2: 0.6, 3: 0.35, 4: 0.1, 5: -0.05, 6: -0.15, 7: -0.2, 8: -0.15, 9: -0.1 }),
            timescale: { pitch: 0.9, rate: 0.95 },
            lowPass: { smoothing: 8 },
        },
    },
    {
        name: 'trap',
        label: 'Trap',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.8, 1: 0.7, 2: 0.55, 3: 0.4, 4: 0.2, 5: 0.05, 6: -0.05, 7: -0.1, 10: 0.1, 11: 0.15 }),
            tremolo: { frequency: 5, depth: 0.2 },
        },
    },
    {
        name: 'futurebass',
        label: 'Future Bass',
        aliases: ['future'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            vibrato: { frequency: 4, depth: 0.3 },
        },
    },
    {
        name: 'bigroom',
        label: 'Big Room',
        aliases: ['bigroomhouse'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.4, 3: 0.25, 4: 0.1, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3 }),
        },
    },
    {
        name: 'deephouse',
        label: 'Deep House',
        aliases: ['dh'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.55, 1: 0.5, 2: 0.4, 3: 0.25, 4: 0.1, 6: -0.1, 7: -0.15, 9: 0.1, 10: 0.15, 11: 0.15 }),
            lowPass: { smoothing: 4 },
        },
    },
    {
        name: 'electro',
        label: 'Electro',
        aliases: ['electrohouse'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25 }),
            distortion: DISTORTION_SOFT,
            tremolo: { frequency: 7, depth: 0.15 },
        },
    },
    {
        name: 'gabber',
        label: 'Gabber',
        aliases: ['gabba'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.9, 1: 0.8, 2: 0.65, 3: 0.5, 4: 0.3, 5: 0.1, 6: -0.05, 7: -0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
            distortion: DISTORTION_HARD,
            timescale: { speed: 1.3 },
        },
    },
    {
        name: 'breakcore',
        label: 'Breakcore',
        aliases: ['breaks'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.75, 1: 0.65, 2: 0.5, 3: 0.35, 4: 0.2, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25 }),
            distortion: DISTORTION_HARD,
            timescale: { speed: 1.25 },
        },
    },
    {
        name: 'jungle',
        label: 'Jungle',
        aliases: ['junglist'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.75, 1: 0.65, 2: 0.5, 3: 0.35, 4: 0.2, 5: 0.05, 6: -0.05, 7: -0.1, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
            timescale: { speed: 1.15 },
        },
    },
    {
        name: 'psytrance',
        label: 'Psytrance',
        aliases: ['psy'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.25, 10: 0.35, 11: 0.4, 12: 0.35, 13: 0.25 }),
            tremolo: { frequency: 8, depth: 0.25 },
        },
    },
    {
        name: 'acid',
        label: 'Acid',
        aliases: ['acidhouse'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.55, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.2, 5: 0.1, 9: 0.2, 10: 0.35, 11: 0.4, 12: 0.35, 13: 0.2 }),
            distortion: DISTORTION_SOFT,
            vibrato: { frequency: 6, depth: 0.25 },
        },
    },
    {
        name: 'chiptune',
        label: 'Chiptune',
        aliases: ['8bit', 'gameboy'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.35, 12: 0.4, 13: 0.35, 14: 0.25 }),
            timescale: { pitch: 1.1 },
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'retro',
        label: 'Retro',
        aliases: ['80s', 'retrowave'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.35, 1: 0.35, 2: 0.3, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.2, 11: 0.25, 12: 0.25, 13: 0.15 }),
            timescale: { pitch: 1.05 },
            lowPass: { smoothing: 3 },
        },
    },
    {
        name: 'garage',
        label: 'UK Garage',
        aliases: ['ukgarage'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25 }),
            lowPass: { smoothing: 5 },
            tremolo: { frequency: 5, depth: 0.2 },
        },
    },
    {
        name: 'club',
        label: 'Club',
        aliases: ['clubmix'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            rotation: { rotationHz: 0.15 },
        },
    },
];
