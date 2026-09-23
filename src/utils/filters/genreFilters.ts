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
        aliases: ['jazzy'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'classical',
        label: 'Classical',
        aliases: ['classic'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.2, 3: 0.15, 4: 0.1, 5: 0.1, 6: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.2, 13: 0.15 }),
        },
    },
    {
        name: 'country',
        label: 'Country',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 9: 0.15, 10: 0.2, 11: 0.25, 12: 0.2 }),
        },
    },
    {
        name: 'reggae',
        label: 'Reggae',
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
        aliases: ['rap'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.65, 1: 0.6, 2: 0.5, 3: 0.35, 4: 0.2, 5: 0.05, 6: -0.05, 7: -0.1, 9: 0.1, 10: 0.15, 11: 0.15, 12: 0.1 }),
        },
    },
    {
        name: 'kpop',
        label: 'K-Pop',
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.45, 1: 0.4, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
        },
    },
    {
        name: 'jpop',
        label: 'J-Pop',
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
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'rnb',
        label: 'R&B',
        aliases: ['r&b', 'randb'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.1, 6: -0.05, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'funk',
        label: 'Funk',
        aliases: ['funky'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
        },
    },
    {
        name: 'disco',
        label: 'Disco',
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
        aliases: [],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.15, 3: 0.15, 4: 0.1, 5: 0.1, 6: 0.05, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'gaming',
        label: 'Gaming',
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
        aliases: ['soulful'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.4, 2: 0.3, 3: 0.2, 4: 0.1, 5: 0.05, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'gospel',
        label: 'Gospel',
        aliases: ['choir'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.2, 4: 0.15, 5: 0.1, 9: 0.1, 10: 0.2, 11: 0.25, 12: 0.2 }),
        },
    },
    {
        name: 'folk',
        label: 'Folk',
        aliases: ['folksy'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.25, 1: 0.25, 2: 0.2, 3: 0.15, 4: 0.1, 5: 0.1, 9: 0.1, 10: 0.15, 11: 0.2, 12: 0.15 }),
        },
    },
    {
        name: 'indie',
        label: 'Indie',
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
        aliases: ['afro'],
        category: FilterCategory.GENRE,
        options: {
            equalizer: eqBands({ 0: 0.55, 1: 0.5, 2: 0.4, 3: 0.3, 4: 0.15, 5: 0.05, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25 }),
            lowPass: { smoothing: 4 },
            tremolo: { frequency: 4, depth: 0.2 },
        },
    },
];
