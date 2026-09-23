import { FilterCategory } from '../../@types/index.js';
import { DISTORTION_HARD, DISTORTION_SOFT, eqBands } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/**
 * Genre flavoured filters
 */
export const GENRE_FILTERS: FilterDefinition[] = [
    {
        name: 'lofi',
        label: 'Lo-Fi',
        description: 'Chill lo-fi: soft, slow and slightly muffled.',
        aliases: ['chill'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.25, 2: 0.2, 3: 0.1, 5: -0.1, 6: -0.15, 7: -0.2, 8: -0.15, 9: -0.1, 10: -0.05 }),
            timescale: { pitch: 0.95, rate: 0.95 },
            lowPass: { smoothing: 6 },
        },
    },
    {
        name: 'rock',
        label: 'Rock',
        description: 'Guitar-forward rock curve with light drive.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 5: 0.1, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'metal',
        label: 'Metal',
        description: 'Aggressive metal curve with heavy distortion.',
        aliases: ['metalcore'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.4, 2: 0.35, 3: 0.3, 4: 0.2, 5: 0.1, 6: 0.05, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
            distortion: DISTORTION_HARD,
        },
    },
    {
        name: 'punk',
        label: 'Punk',
        description: 'Fast punk curve with a gritty edge.',
        aliases: ['punkrock'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3 }),
            distortion: DISTORTION_SOFT,
            timescale: { speed: 1.1 },
        },
    },
    {
        name: 'jazz',
        label: 'Jazz',
        description: 'Warm jazz balance with smooth mids.',
        aliases: ['jazzy'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'classical',
        label: 'Classical',
        description: 'Natural classical balance with gentle warmth.',
        aliases: ['classic'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.2, 3: 0.15, 4: 0.1, 5: 0.1, 6: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.2, 13: 0.15 }),
        },
    },
    {
        name: 'country',
        label: 'Country',
        description: 'Bright country curve with warm lows.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 9: 0.15, 10: 0.2, 11: 0.25, 12: 0.2 }),
        },
    },
    {
        name: 'reggae',
        label: 'Reggae',
        description: 'Laid-back reggae with rolled-off highs.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.2, 4: 0.05, 5: -0.05, 6: -0.1, 7: -0.1, 9: 0.1, 10: 0.2, 11: 0.2 }),
            lowPass: { smoothing: 4 },
        },
    },
    {
        name: 'hiphop',
        label: 'Hip-Hop',
        description: 'Bass-forward hip-hop curve with clear vocals.',
        aliases: ['rap'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.65, 1: 0.6, 2: 0.5, 3: 0.35, 4: 0.2, 5: 0.05, 6: -0.05, 7: -0.1, 9: 0.1, 10: 0.15, 11: 0.15, 12: 0.1 }),
        },
    },
    {
        name: 'kpop',
        label: 'K-Pop',
        description: 'Bright K-pop curve with punchy bass.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.45, 1: 0.4, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
        },
    },
    {
        name: 'jpop',
        label: 'J-Pop',
        description: 'Bright J-pop curve with a slightly raised pitch.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.35, 2: 0.3, 3: 0.25, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
            timescale: { pitch: 1.05 },
        },
    },
    {
        name: 'anime',
        label: 'Anime',
        description: 'Energetic anime opening curve, faster and brighter.',
        aliases: ['weeb'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.35, 1: 0.35, 2: 0.3, 3: 0.25, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
            timescale: { speed: 1.05, pitch: 1.1 },
        },
    },
    {
        name: 'pop',
        label: 'Pop',
        description: 'Polished pop curve with balanced bass and treble.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'rnb',
        label: 'R&B',
        description: 'Smooth R&B with warm bass and silky highs.',
        aliases: ['r&b', 'randb'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.1, 6: -0.05, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'funk',
        label: 'Funk',
        description: 'Funky curve with punchy bass and bright horns.',
        aliases: ['funky'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'disco',
        label: 'Disco',
        description: 'Classic disco sparkle with rotating energy.',
        aliases: ['discotheque'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.45, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
            rotation: { rotationHz: 0.2 },
        },
    },
    {
        name: 'acoustic',
        label: 'Acoustic',
        description: 'Gentle acoustic curve that keeps the mids natural.',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.15, 3: 0.15, 4: 0.1, 5: 0.1, 6: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'gaming',
        label: 'Gaming',
        description: 'Wide gaming curve with rotation and subtle tremolo.',
        aliases: ['game'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            rotation: { rotationHz: 0.25 },
            tremolo: { frequency: 4, depth: 0.15 },
        },
    },
    {
        name: 'blues',
        label: 'Blues',
        description: 'Warm blues curve with a soft lowpass.',
        aliases: ['bluesy'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.35, 1: 0.35, 2: 0.3, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.1, 10: 0.15, 11: 0.15, 12: 0.1 }),
            lowPass: { smoothing: 3 },
        },
    },
    {
        name: 'soul',
        label: 'Soul',
        description: 'Rich soul curve with warm lows and smooth highs.',
        aliases: ['soulful'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'gospel',
        label: 'Gospel',
        description: 'Uplifting gospel curve with clear mids.',
        aliases: ['choir'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 5: 0.1, 9: 0.1, 10: 0.2, 11: 0.25, 12: 0.2 }),
        },
    },
    {
        name: 'folk',
        label: 'Folk',
        description: 'Natural folk balance with a light warmth.',
        aliases: ['folksy'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.25, 1: 0.25, 2: 0.2, 3: 0.15, 4: 0.1, 5: 0.1, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'indie',
        label: 'Indie',
        description: 'Indie rock curve with a soft, warm top end.',
        aliases: ['indierock'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.2 }),
            lowPass: { smoothing: 3 },
        },
    },
    {
        name: 'latin',
        label: 'Latin',
        description: 'Energetic latin curve with a light tremolo.',
        aliases: ['latino'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            tremolo: { frequency: 5, depth: 0.2 },
        },
    },
    {
        name: 'afrobeat',
        label: 'Afrobeat',
        description: 'Afrobeat groove with warm bass and a soft tremolo.',
        aliases: ['afro'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.55, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25 }),
            lowPass: { smoothing: 4 },
            tremolo: { frequency: 4, depth: 0.2 },
        },
    },
];
