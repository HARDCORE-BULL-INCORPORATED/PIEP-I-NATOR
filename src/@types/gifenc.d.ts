declare module 'gifenc' {
    /** Color table produced by quantize() as a list of [r, g, b] entries */
    export type GifPalette = number[][];

    export type GifColorFormat = 'rgb565' | 'rgb444' | 'rgba4444';

    export interface GifQuantizeOptions {
        /** Color format used for quantization, defaults to "rgb565" */
        format?: GifColorFormat;
        /** Collapse alpha to one bit at the given threshold when using "rgba4444" */
        oneBitAlpha?: boolean | number;
        /** Replace fully transparent colors with the clear color when using an alpha format */
        clearAlpha?: boolean;
        /** Alpha threshold below which colors are replaced with the clear color */
        clearAlphaThreshold?: number;
        /** RGB value substituted for cleared transparent colors */
        clearAlphaColor?: number;
    }

    export interface GifFrameOptions {
        /** Color table written on the first frame, reused by every following frame */
        palette?: GifPalette;
        /** Frame duration in milliseconds */
        delay?: number;
        /** Loop behavior: -1 plays once, 0 loops forever, > 0 repeats a fixed amount */
        repeat?: number;
        /** Enable the transparent color index for this frame */
        transparent?: boolean;
        /** Palette index treated as transparent */
        transparentIndex?: number;
        /** GIF disposal method for this frame */
        dispose?: number;
        /** Bits of color depth used for the color table */
        colorDepth?: number;
        /** Marks a frame as the first one in manual (non-auto) mode */
        first?: boolean;
    }

    export interface GifEncoderInstance {
        writeFrame(index: Uint8Array, width: number, height: number, options?: GifFrameOptions): void;
        finish(): void;
        reset(): void;
        bytes(): Uint8Array;
        bytesView(): Uint8Array;
    }

    export interface GifEncoderOptions {
        /** Write the header and color table automatically on the first frame */
        auto?: boolean;
        /** Initial capacity of the output stream in bytes */
        initialCapacity?: number;
    }

    export function GIFEncoder(options?: GifEncoderOptions): GifEncoderInstance;

    export function quantize(
        rgba: Uint8Array | Uint8ClampedArray,
        maxColors: number,
        options?: GifQuantizeOptions
    ): GifPalette;

    export function applyPalette(
        rgba: Uint8Array | Uint8ClampedArray,
        palette: GifPalette,
        format?: GifColorFormat
    ): Uint8Array;
}
