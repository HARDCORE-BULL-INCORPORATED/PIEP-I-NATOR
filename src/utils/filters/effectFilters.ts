import { FilterCategory } from '../../@types/index.js';
import { DISTORTION_HARD, DISTORTION_SOFT, MONO_CHANNEL_MIX, eqBands } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/**
 * Sound effect and atmosphere filters
 */
export const EFFECT_FILTERS: FilterDefinition[] = [
    {
        name: 'karaoke',
        label: 'Karaoke',
        aliases: ['singalong'],
        category: FilterCategory.EFFECT,
        options: {
            karaoke: {
                level: 0.8,
                monoLevel: 1.0,
                filterBand: 220.0,
                filterWidth: 100.0,
            },
        },
    },
    {
        name: 'lowpass',
        label: 'Low Pass',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            lowPass: { smoothing: 15 },
        },
    },
    {
        name: 'soft',
        label: 'Soft',
        aliases: ['gentle'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.1, 1: 0.1, 2: 0.1, 7: -0.1, 8: -0.2 }),
            lowPass: { smoothing: 5 },
        },
    },
    {
        name: '8d',
        label: '8D',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            rotation: { rotationHz: 0.2 },
        },
    },
    {
        name: '16d',
        label: '16D',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            rotation: { rotationHz: 0.5 },
        },
    },
    {
        name: 'vibrato',
        label: 'Vibrato',
        aliases: ['vib'],
        category: FilterCategory.EFFECT,
        options: {
            vibrato: { frequency: 4, depth: 0.75 },
        },
    },
    {
        name: 'tremolo',
        label: 'Tremolo',
        aliases: ['trem'],
        category: FilterCategory.EFFECT,
        options: {
            tremolo: { frequency: 5, depth: 0.5 },
        },
    },
    {
        name: 'muffle',
        label: 'Muffled',
        aliases: ['muffled'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.15, 9: -0.15, 10: -0.2, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            lowPass: { smoothing: 18 },
        },
    },
    {
        name: 'radio',
        label: 'Radio',
        aliases: ['amradio'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: -0.1, 1: -0.05, 2: 0.05, 3: 0.15, 4: 0.25, 5: 0.3, 6: 0.25, 7: 0.15, 8: 0.1, 9: -0.1, 10: -0.2, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            distortion: DISTORTION_SOFT,
            lowPass: { smoothing: 8 },
        },
    },
    {
        name: 'phone',
        label: 'Phone',
        aliases: ['telephone'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: -0.2, 1: -0.1, 2: 0.1, 3: 0.25, 4: 0.35, 5: 0.35, 6: 0.25, 7: 0.1, 9: -0.15, 10: -0.25, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            distortion: DISTORTION_SOFT,
            lowPass: { smoothing: 10 },
            channelMix: MONO_CHANNEL_MIX,
        },
    },
    {
        name: 'underwater',
        label: 'Underwater',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            lowPass: { smoothing: 20 },
            tremolo: { frequency: 2, depth: 0.6 },
        },
    },
    {
        name: 'robot',
        label: 'Robot',
        aliases: ['robotic'],
        category: FilterCategory.EFFECT,
        options: {
            distortion: DISTORTION_SOFT,
            vibrato: { frequency: 12, depth: 0.6 },
            channelMix: MONO_CHANNEL_MIX,
        },
    },
    {
        name: 'alien',
        label: 'Alien',
        aliases: ['extraterrestrial'],
        category: FilterCategory.EFFECT,
        options: {
            timescale: { speed: 0.9, pitch: 1.5 },
            tremolo: { frequency: 8, depth: 0.4 },
            vibrato: { frequency: 10, depth: 0.3 },
        },
    },
    {
        name: 'party',
        label: 'Party',
        aliases: ['partymode'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.45, 2: 0.35, 3: 0.25, 4: 0.15, 9: 0.15, 10: 0.25, 11: 0.3, 12: 0.25, 13: 0.15 }),
            rotation: { rotationHz: 0.25 },
            tremolo: { frequency: 4, depth: 0.2 },
        },
    },
    {
        name: 'concert',
        label: 'Concert',
        aliases: ['live'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.25, 3: 0.15, 4: 0.05, 5: -0.05, 6: -0.1, 7: -0.1, 8: -0.05, 9: 0.05, 10: 0.1, 11: 0.15, 12: 0.15, 13: 0.1 }),
            lowPass: { smoothing: 3 },
            rotation: { rotationHz: 0.1 },
        },
    },
    {
        name: 'cave',
        label: 'Cave',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.25, 2: 0.15, 4: -0.1, 5: -0.15, 6: -0.2, 7: -0.2, 8: -0.2, 9: -0.2, 10: -0.25, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            lowPass: { smoothing: 14 },
            rotation: { rotationHz: 0.08 },
        },
    },
    {
        name: 'hall',
        label: 'Hall',
        aliases: ['hallway'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.15, 3: 0.05, 4: -0.05, 5: -0.1, 6: -0.1, 7: -0.1, 8: -0.1, 9: -0.1, 10: -0.15, 11: -0.15, 12: -0.15, 13: -0.15, 14: -0.15 }),
            lowPass: { smoothing: 6 },
            rotation: { rotationHz: 0.12 },
        },
    },
    {
        name: 'stadium',
        label: 'Stadium',
        aliases: ['arena'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.25, 1: 0.2, 2: 0.15, 3: 0.05, 4: -0.05, 5: -0.1, 6: -0.1, 7: -0.1, 8: -0.05, 11: -0.05, 12: -0.1, 13: -0.1, 14: -0.1 }),
            lowPass: { smoothing: 4 },
            rotation: { rotationHz: 0.18 },
        },
    },
    {
        name: 'tunnel',
        label: 'Tunnel',
        aliases: ['tunnelvision'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.35, 2: 0.25, 3: 0.1, 4: -0.05, 5: -0.15, 6: -0.2, 7: -0.25, 8: -0.25, 9: -0.25, 10: -0.25, 11: -0.25, 12: -0.25, 13: -0.25, 14: -0.25 }),
            lowPass: { smoothing: 12 },
            rotation: { rotationHz: 0.4 },
        },
    },
    {
        name: 'popcorn',
        label: 'Popcorn',
        aliases: [],
        category: FilterCategory.EFFECT,
        options: {
            timescale: { speed: 1.1, pitch: 1.1 },
            tremolo: { frequency: 10, depth: 0.7 },
        },
    },
    {
        name: 'earrape',
        label: 'Earrape',
        aliases: ['loud'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 1, 1: 1, 2: 0.9, 3: 0.8, 4: 0.7, 5: 0.6, 6: 0.5, 7: 0.5, 8: 0.5, 9: 0.6, 10: 0.7, 11: 0.8, 12: 0.9, 13: 1, 14: 1 }),
            distortion: DISTORTION_HARD,
        },
    },
    {
        name: 'vocal',
        label: 'Vocal Boost',
        aliases: ['voice', 'vocalboost'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: -0.25, 1: -0.25, 2: -0.2, 3: -0.1, 4: 0.1, 5: 0.3, 6: 0.4, 7: 0.35, 8: 0.25, 9: 0.15, 10: 0.1, 11: 0.05, 12: -0.05, 13: -0.1, 14: -0.15 }),
        },
    },
    {
        name: 'treble',
        label: 'Treble Boost',
        aliases: ['highs', 'trebleboost'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: -0.25, 1: -0.25, 2: -0.2, 3: -0.1, 4: -0.05, 6: 0.05, 7: 0.1, 8: 0.2, 9: 0.3, 10: 0.4, 11: 0.45, 12: 0.45, 13: 0.4, 14: 0.35 }),
        },
    },
    {
        name: 'ghost',
        label: 'Ghost',
        aliases: ['haunted', 'spooky'],
        category: FilterCategory.EFFECT,
        options: {
            timescale: { pitch: 1.2, rate: 0.85 },
            lowPass: { smoothing: 10 },
            tremolo: { frequency: 3, depth: 0.4 },
        },
    },
    {
        name: 'dreamy',
        label: 'Dreamy',
        aliases: ['dream'],
        category: FilterCategory.EFFECT,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.15, 3: 0.05, 4: -0.05, 5: -0.1, 6: -0.15, 7: -0.15, 8: -0.1, 10: 0.05, 11: 0.1, 12: 0.1, 13: 0.05 }),
            timescale: { pitch: 1.05, rate: 0.9 },
            lowPass: { smoothing: 6 },
            rotation: { rotationHz: 0.15 },
        },
    },
];
