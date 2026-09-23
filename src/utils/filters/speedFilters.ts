import { FilterCategory } from '../../@types/index.js';
import { DISTORTION_SOFT, eqBands } from './presets.js';

import type { FilterDefinition } from '../../@types/index.js';


/**
 * Speed and pitch filters
 */
export const SPEED_FILTERS: FilterDefinition[] = [
    {
        name: '2xfaster',
        label: '2x Faster',
        aliases: ['2x', 'fast', 'speedup', 'spedup'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 2 },
        },
    },
    {
        name: 'speed',
        label: 'Speed',
        aliases: ['faster'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.5, pitch: 1.2 },
        },
    },
    {
        name: 'slow',
        label: 'Slow',
        aliases: ['slowdown'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.8 },
        },
    },
    {
        name: 'slowed',
        label: 'Slowed',
        aliases: [],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.85, pitch: 0.9 },
        },
    },
    {
        name: 'slowedreverb',
        label: 'Slowed + Reverb',
        aliases: ['reverb'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.15, 12: -0.1, 13: -0.15, 14: -0.2 }),
            timescale: { speed: 0.8, pitch: 0.9 },
            lowPass: { smoothing: 5 },
            rotation: { rotationHz: 0.05 },
        },
    },
    {
        name: 'nightcore',
        label: 'Nightcore',
        aliases: ['nc'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.2, 3: 0.1, 9: 0.1, 10: 0.2, 11: 0.2, 12: 0.1, 13: -0.1, 14: -0.2 }),
            timescale: { pitch: 1.2, rate: 1.15 },
            tremolo: { depth: 0.2, frequency: 12 },
        },
    },
    {
        name: 'daycore',
        label: 'Daycore',
        aliases: ['dc'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.9, pitch: 0.9, rate: 0.9 },
        },
    },
    {
        name: 'vaporwave',
        label: 'Vaporwave',
        aliases: ['vw'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.2, 1: 0.2, 2: 0.1, 4: -0.1, 5: -0.1, 8: 0.1, 9: 0.2, 10: 0.3, 11: 0.2, 12: 0.1, 14: -0.1 }),
            timescale: { pitch: 0.9, rate: 0.95 },
            tremolo: { depth: 0.1, frequency: 6 },
        },
    },
    {
        name: 'chipmunk',
        label: 'Chipmunk',
        aliases: ['chip', 'chipmunked'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.3, pitch: 1.5 },
        },
    },
    {
        name: 'deep',
        label: 'Deep Voice',
        aliases: ['deepvoice'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 0.7, rate: 0.9 },
        },
    },
    {
        name: 'demon',
        label: 'Demon',
        aliases: ['demonic'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.4, 1: 0.35, 2: 0.2 }),
            timescale: { pitch: 0.5, rate: 0.8 },
        },
    },
    {
        name: 'darthvader',
        label: 'Darth Vader',
        aliases: ['vader'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.3, 1: 0.3, 2: 0.2, 3: 0.1 }),
            timescale: { pitch: 0.6, rate: 0.85 },
            distortion: DISTORTION_SOFT,
        },
    },
    {
        name: 'hyper',
        label: 'Hyper',
        aliases: ['hyperpop'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 9: 0.2, 10: 0.3, 11: 0.35, 12: 0.3, 13: 0.2 }),
            timescale: { speed: 1.4, pitch: 1.3 },
        },
    },
    {
        name: 'ultraslow',
        label: 'Ultra Slow',
        aliases: ['veryslow'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.6, pitch: 0.85 },
        },
    },
    {
        name: 'ultrafast',
        label: 'Ultra Fast',
        aliases: ['veryfast'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.8, pitch: 1.4 },
        },
    },
    {
        name: '3xfaster',
        label: '3x Faster',
        aliases: ['3x', 'triple'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 3, pitch: 1.6 },
        },
    },
    {
        name: 'halfspeed',
        label: 'Half Speed',
        aliases: ['half'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.5 },
        },
    },
    {
        name: 'pitchup',
        label: 'Pitch Up',
        aliases: ['up'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 1.35 },
        },
    },
    {
        name: 'pitchdown',
        label: 'Pitch Down',
        aliases: ['down'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 0.75 },
        },
    },
    {
        name: 'helium',
        label: 'Helium',
        aliases: ['balloon'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.15, pitch: 1.6 },
        },
    },
    {
        name: 'monster',
        label: 'Monster',
        aliases: ['ogre'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.5, 1: 0.4, 2: 0.2 }),
            timescale: { speed: 0.85, pitch: 0.55 },
        },
    },
    {
        name: 'squirrel',
        label: 'Squirrel',
        aliases: ['squeaky'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.5, pitch: 1.8 },
        },
    },
    {
        name: 'giant',
        label: 'Giant',
        aliases: ['titan'],
        category: FilterCategory.SPEED,
        options: {
            equalizer: eqBands({ 0: 0.6, 1: 0.5, 2: 0.3 }),
            timescale: { speed: 0.7, pitch: 0.45 },
        },
    },
    {
        name: 'drunk',
        label: 'Drunk',
        aliases: ['drunkmode'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 0.95, rate: 1.05 },
            vibrato: { frequency: 3, depth: 0.7 },
            tremolo: { frequency: 2, depth: 0.3 },
        },
    },
    {
        name: 'stretch',
        label: 'Time Stretch',
        aliases: ['timestretch'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.9, pitch: 0.9, rate: 1.1 },
        },
    },
];
