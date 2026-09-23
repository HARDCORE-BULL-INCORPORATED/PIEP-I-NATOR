import type { DistortionOptions } from 'lavashark/typings/src/@types/index.js';


/** Number of Lavalink equalizer bands */
export const EQ_BAND_COUNT = 15;

/** Lavalink equalizer gain bounds */
const EQ_GAIN_MIN = -0.25;
const EQ_GAIN_MAX = 1.0;

/** Mild overdrive used by radio, phone and rock style filters */
export const DISTORTION_SOFT: DistortionOptions = {
    sinOffset: 0.1,
    sinScale: 1.1,
    cosOffset: 0.1,
    cosScale: 1.1,
    tanOffset: 0.05,
    tanScale: 1.05,
    offset: 0.05,
    scale: 1.1,
};

/** Heavy overdrive used by earrape, hardcore and metal style filters */
export const DISTORTION_HARD: DistortionOptions = {
    sinOffset: 0.2,
    sinScale: 1.3,
    cosOffset: 0.2,
    cosScale: 1.3,
    tanOffset: 0.1,
    tanScale: 1.15,
    offset: 0.1,
    scale: 1.3,
};

/** Channel mix that collapses both channels into mono */
export const MONO_CHANNEL_MIX = {
    leftToLeft: 0.5,
    leftToRight: 0.5,
    rightToLeft: 0.5,
    rightToRight: 0.5,
};

/**
 * Build a 15-band equalizer array from sparse band gains.
 * Band frequencies: 25, 40, 63, 100, 160, 250, 400, 630, 1k, 1.6k, 2.5k, 4k, 6.3k, 10k, 16k Hz.
 * @param gains - Map of band index to gain, omitted bands default to 0
 * @throws {RangeError} When a band index or gain is outside the Lavalink bounds
 */
export const eqBands = (gains: Record<number, number>): number[] => {
    const bands = Array.from({ length: EQ_BAND_COUNT }, () => 0);

    for (const [band, gain] of Object.entries(gains)) {
        const index = Number(band);

        if (!Number.isInteger(index) || index < 0 || index >= EQ_BAND_COUNT) {
            throw new RangeError(`Equalizer band index must be an integer between 0 and ${EQ_BAND_COUNT - 1}, got ${band}`);
        }
        if (gain < EQ_GAIN_MIN || gain > EQ_GAIN_MAX) {
            throw new RangeError(`Equalizer gain for band ${index} must be between ${EQ_GAIN_MIN} and ${EQ_GAIN_MAX}, got ${gain}`);
        }

        bands[index] = gain;
    }

    return bands;
};
