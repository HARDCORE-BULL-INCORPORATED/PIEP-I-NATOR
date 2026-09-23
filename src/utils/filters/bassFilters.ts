import { FilterCategory } from '../../@types/index.js';
import { DISTORTION_SOFT, eqBands } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/**
 * Bass and boost filters
 */
export const BASS_FILTERS: FilterDefinition[] = [
    {
        name: 'bass',
        label: 'Bass',
        aliases: [],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.25, 1: 0.2, 2: 0.1, 3: 0.1, 4: 0.05, 6: -0.05, 7: -0.1 }),
        },
    },
    {
        name: 'bassboost',
        label: 'Bass Boost',
        aliases: ['bb', 'bassplus'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1, 5: 0.05, 6: -0.05, 7: -0.1, 8: -0.05 }),
        },
    },
    {
        name: 'extreme',
        label: 'Extreme Bass',
        aliases: ['extremebass', 'xbass'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.75, 1: 0.65, 2: 0.5, 3: 0.35, 4: 0.2, 5: 0.1, 6: -0.1, 7: -0.15, 8: -0.1, 9: -0.05 }),
        },
    },
    {
        name: 'insane',
        label: 'Insane Bass',
        aliases: ['insanebass'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.9, 2: 0.7, 3: 0.5, 4: 0.3, 5: 0.1, 6: -0.15, 7: -0.2, 8: -0.15, 9: -0.1 }),
        },
    },
    {
        name: 'rebass',
        label: 'Rebassed',
        aliases: ['rebassed'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.85, 2: 0.6, 3: 0.35, 4: 0.15, 5: -0.05, 6: -0.15, 7: -0.2, 8: -0.15, 9: -0.1, 10: -0.05 }),
            lowPass: { smoothing: 10 },
        },
    },
    {
        name: 'subonly',
        label: 'Sub Only',
        aliases: ['sub', 'subs', 'subbass'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.9, 1: 0.6, 2: 0.2, 3: -0.1, 4: -0.25, 5: -0.25, 6: -0.25, 7: -0.25, 8: -0.25, 9: -0.25, 10: -0.25, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            lowPass: { smoothing: 20 },
        },
    },
    {
        name: 'subboost',
        label: 'Sub Boost',
        aliases: ['sb'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.7, 1: 0.5, 2: 0.25, 3: 0.05 }),
        },
    },
    {
        name: 'purebass',
        label: 'Pure Bass',
        aliases: ['pure'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.55, 2: 0.45, 3: 0.3, 4: 0.1 }),
        },
    },
    {
        name: 'megabass',
        label: 'Mega Bass',
        aliases: ['mega'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.9, 1: 0.8, 2: 0.65, 3: 0.45, 4: 0.25, 5: 0.1, 6: -0.1, 7: -0.15, 8: -0.1 }),
        },
    },
    {
        name: 'bassmachine',
        label: 'Bass Machine',
        aliases: ['machine'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.8, 1: 0.7, 2: 0.55, 3: 0.4, 4: 0.25, 5: 0.15, 7: -0.05 }),
            tremolo: { frequency: 3, depth: 0.3 },
        },
    },
    {
        name: 'boost',
        label: 'Boost',
        aliases: ['amplify'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.25, 1: 0.25, 2: 0.2, 3: 0.15, 4: 0.1, 5: 0.05, 9: 0.05, 10: 0.1, 11: 0.15, 12: 0.2, 13: 0.25, 14: 0.25 }),
        },
    },
    {
        name: 'superbass',
        label: 'Super Bass',
        aliases: ['super'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.85, 1: 0.75, 2: 0.6, 3: 0.4, 4: 0.2, 5: 0.05, 6: -0.1, 7: -0.15 }),
        },
    },
    {
        name: 'ultrabass',
        label: 'Ultra Bass',
        aliases: ['ultra'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.95, 2: 0.8, 3: 0.6, 4: 0.35, 5: 0.15, 6: -0.1, 7: -0.15, 8: -0.1 }),
            lowPass: { smoothing: 8 },
        },
    },
    {
        name: 'basshead',
        label: 'Bass Head',
        aliases: ['head'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.95, 1: 0.85, 2: 0.7, 3: 0.5, 4: 0.3, 5: 0.15, 7: -0.05 }),
        },
    },
    {
        name: 'hardbass',
        label: 'Hard Bass',
        aliases: ['hard'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.9, 1: 0.8, 2: 0.6, 3: 0.4, 4: 0.2, 6: -0.1, 7: -0.15 }),
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'overdrive',
        label: 'Overdrive',
        aliases: ['od'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.85, 1: 0.75, 2: 0.55, 3: 0.35, 4: 0.2, 5: 0.05, 7: -0.05 }),
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'rumble',
        label: 'Rumble',
        aliases: ['rumbl'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.8, 2: 0.5, 3: 0.2, 4: -0.05, 5: -0.15, 6: -0.2, 7: -0.25, 8: -0.25 }),
            lowPass: { smoothing: 14 },
        },
    },
    {
        name: 'earthquake',
        label: 'Earthquake',
        aliases: ['quake'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.9, 2: 0.7, 3: 0.45, 4: 0.2, 6: -0.15, 7: -0.2, 8: -0.2, 9: -0.15 }),
            lowPass: { smoothing: 12 },
            tremolo: { frequency: 2, depth: 0.2 },
        },
    },
    {
        name: 'lowend',
        label: 'Low End',
        aliases: ['lows'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.2, 4: 0.05, 5: -0.05, 6: -0.1, 7: -0.1 }),
        },
    },
    {
        name: 'deepbass',
        label: 'Deep Bass',
        aliases: ['dbass'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.9, 1: 0.7, 2: 0.45, 3: 0.25, 4: 0.1, 6: -0.1, 7: -0.15 }),
            timescale: { pitch: 0.95, rate: 1 },
        },
    },
    {
        name: 'wobble',
        label: 'Wobble',
        aliases: ['wob'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.7, 1: 0.6, 2: 0.45, 3: 0.3, 4: 0.15, 6: -0.1, 7: -0.15 }),
            lowPass: { smoothing: 6 },
            tremolo: { frequency: 6, depth: 0.6 },
        },
    },
    {
        name: 'bassdrop',
        label: 'Bass Drop',
        aliases: ['drop'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.85, 2: 0.6, 3: 0.35, 4: 0.1, 5: -0.1, 6: -0.2, 7: -0.25, 8: -0.2 }),
            lowPass: { smoothing: 15 },
        },
    },
    {
        name: 'subwoofer',
        label: 'Subwoofer',
        aliases: ['woofer'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 1, 1: 0.7, 2: 0.3, 3: -0.05, 4: -0.2, 5: -0.25, 6: -0.25, 7: -0.25, 8: -0.25, 9: -0.25, 10: -0.25, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            lowPass: { smoothing: 20 },
        },
    },
    {
        name: 'bassline',
        label: 'Bassline',
        aliases: ['line'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.55, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.2, 5: 0.1, 7: -0.05 }),
        },
    },
    {
        name: 'punch',
        label: 'Punch',
        aliases: ['punchy'],
        category: FilterCategory.BASS,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.5, 2: 0.55, 3: 0.45, 4: 0.25, 5: 0.05, 6: -0.1, 7: -0.15, 8: -0.1 }),
        },
    },
];
