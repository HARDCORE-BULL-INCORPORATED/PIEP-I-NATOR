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
        description: 'Doubles the playback speed.',
        aliases: ['2x', 'fast', 'speedup', 'spedup'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 2 },
        },
    },
    {
        name: 'speed',
        label: 'Speed',
        description: 'Faster playback with a raised pitch.',
        aliases: ['faster'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.5, pitch: 1.2 },
        },
    },
    {
        name: 'slow',
        label: 'Slow',
        description: 'Slows playback to 80%.',
        aliases: ['slowdown'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.8 },
        },
    },
    {
        name: 'slowed',
        label: 'Slowed',
        description: 'Slowed down with a slightly lower pitch.',
        aliases: [],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.85, pitch: 0.9 },
        },
    },
    {
        name: 'slowedreverb',
        label: 'Slowed + Reverb',
        description: 'Slowed and pitched down with a soft reverb-like tail.',
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
        description: 'Classic nightcore: faster, higher pitched, with sparkle.',
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
        description: 'Slower, lower-pitched nightcore counterpart.',
        aliases: ['dc'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.9, pitch: 0.9, rate: 0.9 },
        },
    },
    {
        name: 'vaporwave',
        label: 'Vaporwave',
        description: 'Slowed and pitch-bent with a nostalgic haze.',
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
        description: 'Fast and very high-pitched chipmunk voice.',
        aliases: ['chip', 'chipmunked'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.3, pitch: 1.5 },
        },
    },
    {
        name: 'deep',
        label: 'Deep Voice',
        description: 'Deep voice: lowered pitch and tempo.',
        aliases: ['deepvoice'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 0.7, rate: 0.9 },
        },
    },
    {
        name: 'demon',
        label: 'Demon',
        description: 'Very low pitch with a slow, dark tone.',
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
        description: 'Low-pitched and distorted for a heavy villain voice.',
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
        description: 'Fast and high with boosted treble.',
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
        description: 'Very slow playback with a lowered pitch.',
        aliases: ['veryslow'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.6, pitch: 0.85 },
        },
    },
    {
        name: 'ultrafast',
        label: 'Ultra Fast',
        description: 'Very fast playback with a raised pitch.',
        aliases: ['veryfast'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.8, pitch: 1.4 },
        },
    },
    {
        name: '3xfaster',
        label: '3x Faster',
        description: 'Triple playback speed.',
        aliases: ['3x', 'triple'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 3, pitch: 1.6 },
        },
    },
    {
        name: 'halfspeed',
        label: 'Half Speed',
        description: 'Half playback speed.',
        aliases: ['half'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.5 },
        },
    },
    {
        name: 'pitchup',
        label: 'Pitch Up',
        description: 'Raises pitch without changing tempo.',
        aliases: ['up'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 1.35 },
        },
    },
    {
        name: 'pitchdown',
        label: 'Pitch Down',
        description: 'Lowers pitch without changing tempo.',
        aliases: ['down'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { pitch: 0.75 },
        },
    },
    {
        name: 'helium',
        label: 'Helium',
        description: 'High-pitched and slightly faster, like inhaling helium.',
        aliases: ['balloon'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.15, pitch: 1.6 },
        },
    },
    {
        name: 'monster',
        label: 'Monster',
        description: 'Slow and very low-pitched monster voice.',
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
        description: 'Extremely fast and squeaky.',
        aliases: ['squeaky'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 1.5, pitch: 1.8 },
        },
    },
    {
        name: 'giant',
        label: 'Giant',
        description: 'Slow and deep, like a giant talking.',
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
        description: 'Wobbly pitch and volume for a drunken feel.',
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
        description: 'Time-stretched playback with a lower pitch.',
        aliases: ['timestretch'],
        category: FilterCategory.SPEED,
        options: {
            timescale: { speed: 0.9, pitch: 0.9, rate: 1.1 },
        },
    },
];
