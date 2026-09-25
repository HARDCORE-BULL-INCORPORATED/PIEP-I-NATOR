const SEGMENT_COUNT = 20;
const SEGMENT_FILL = '▬';

/**
 * Custom emoji ID used as the moving knob of the dashboard progress bar.
 */
export const PROGRESS_KNOB_ID = '857578206218158080';

/**
 * Plain emoji used when the custom knob emoji is not available to the client.
 */
export const PROGRESS_KNOB_FALLBACK = '🔘';


/**
 * Format a track position as `m:ss` or `h:mm:ss`.
 */
const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Render a playback progress line with the current time, a bar whose knob
 * marks the playback spot, and the total duration.
 *
 * @param positionMs - Current playback position in milliseconds.
 * @param durationMs - Total track duration in milliseconds.
 * @param knob - Emoji placed at the playback spot.
 * @returns Formatted line such as `0:42 ▬▬▬🔘▬▬▬▬ 3:45`.
 */
export const createProgressBar = (positionMs: number, durationMs: number, knob: string): string => {
    const progress = durationMs > 0
        ? Math.min(1, Math.max(0, positionMs / durationMs))
        : 0;
    const knobIndex = Math.min(SEGMENT_COUNT - 1, Math.floor(progress * (SEGMENT_COUNT - 1)));
    const bar = Array.from(
        { length: SEGMENT_COUNT },
        (_, index) => index === knobIndex ? knob : SEGMENT_FILL
    ).join('');

    return `${formatTime(positionMs)} ${bar} ${formatTime(durationMs)}`;
};
