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
        description: 'Driving techno curve with steady bass and crisp highs.',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.1, 9: 0.1, 10: 0.2, 11: 0.25, 12: 0.2, 13: 0.1 }),
        },
    },
    {
        name: 'house',
        label: 'House',
        description: 'Warm four-on-the-floor house balance.',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1, 9: 0.15, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'trance',
        label: 'Trance',
        description: 'Airy trance lift with sparkling highs.',
        aliases: [],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.35, 1: 0.3, 2: 0.25, 3: 0.15, 4: 0.1, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
        },
    },
    {
        name: 'edm',
        label: 'EDM',
        description: 'Festival EDM curve with strong bass and bright leads.',
        aliases: ['dance'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'dubstep',
        label: 'Dubstep',
        description: 'Heavy wobbling bass with distortion.',
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
        description: 'Fast bass-heavy drum & bass curve.',
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
        description: 'Hard-hitting bass with distorted kicks.',
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
        description: 'Faster, distorted and aggressive hardcore sound.',
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
        description: 'Rotating rave energy with bright highs.',
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
        description: 'Warm synthwave curve with slightly lowered pitch.',
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
        description: 'Dark, slowed phonk with heavy sub-bass.',
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
        description: 'Deep 808-style bass with a subtle tremolo.',
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
        description: 'Bright future bass with a wobbling top end.',
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
        description: 'Big room curve with a wide, bright top end.',
        aliases: ['bigroomhouse'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.4, 3: 0.25, 4: 0.1, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3 }),
        },
    },
    {
        name: 'deephouse',
        label: 'Deep House',
        description: 'Smooth deep house with rolled-off highs.',
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
        description: 'Gritty electro curve with mild distortion.',
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
        description: 'Fast, hard and heavily distorted gabber.',
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
        description: 'Fast breakcore with aggressive distortion.',
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
        description: 'Fast jungle breakbeat curve with deep bass.',
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
        description: 'Hypnotic psytrance with a pulsing tremolo.',
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
        description: 'Squelchy acid curve with vibrato and drive.',
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
        description: '8-bit style: bright, gritty and slightly higher pitched.',
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
        description: 'Retro 80s curve with a warm lowpass.',
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
        description: 'UK garage swing with a soft lowpass.',
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
        description: 'Club-ready curve with a slow rotation.',
        aliases: ['clubmix'],
        category: FilterCategory.ELECTRONIC,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            rotation: { rotationHz: 0.15 },
        },
    },
];
