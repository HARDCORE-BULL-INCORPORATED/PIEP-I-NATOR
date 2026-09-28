import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import { EmbedBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';

import { SLOT_RARITY_COLORS } from './SlotMachine.types.js';

import type { Canvas, Image, SKRSContext2D } from '@napi-rs/canvas';
import type { HexColorString } from 'discord.js';
import type { GifPalette } from 'gifenc';
import type SlotMachine from './SlotMachine.js';
import type { SlotItem, SpinResult } from './SlotMachine.types.js';


/** Attachment name of the animated unboxing GIF referenced by embeds */
export const SPIN_ATTACHMENT_NAME = 'case.gif';

/** Attachment name of the static multi-open summary image */
export const SUMMARY_ATTACHMENT_NAME = 'cases.png';

const ASSETS_DIRECTORY = fileURLToPath(new URL('./assets/', import.meta.url));

const WIDTH = 480;
const HEIGHT = 124;
const CELL_WIDTH = 92;
const CELL_HEIGHT = 116;
const CELL_GAP = 4;
const CELL_SPACING = CELL_WIDTH + CELL_GAP;
const CELL_Y = 4;
const VISIBLE_CELLS = Math.ceil(WIDTH / CELL_SPACING) + 2;
const FADE_WIDTH = 48;
const MARKER_SIZE = 14;
const BACKGROUND_COLOR = '#15171d';
const CARD_DARK: [number, number, number] = [35, 38, 46];
const PALETTE_SIZE = 256;

const SPIN_DURATION_MS = 5200;
const LANDING_PULSE_MS = 500;
const HOLD_MS = 600;
const FRAME_RATE = 20;
const HOLD_FRAME_DELAY_MS = 120;
const LANDING_PULSE_SCALE = 0.08;
const WINNER_JITTER_RATIO = 0.3;

const CELL_RADIUS = 8;
const CELL_IMAGE_PADDING_X = 16;
const CELL_IMAGE_PADDING_Y = 26;
const HIGHLIGHT_BORDER_WIDTH = 3;
const BORDER_WIDTH = 1.5;

/**
 * Assets shared by every spin of one case, cached across command runs
 */
interface CaseAssets {
    readonly cells: Map<string, Canvas>;
    readonly images: Map<string, Image>;
    readonly highlighted: Map<string, Canvas>;
    readonly palette: GifPalette;
    readonly background: Canvas;
    readonly marker: Canvas;
    readonly fadeLeft: Canvas;
    readonly fadeRight: Canvas;
}

const caseAssetsCache = new Map<string, Promise<CaseAssets>>();

const hexToRgb = (hex: string): [number, number, number] => [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16)
];

/**
 * Blend a hex color towards a target RGB color
 * @param {string} hex - Source hex color such as #ffffff
 * @param {[number, number, number]} target - RGB color mixed into the source
 * @param {number} amount - Mix ratio where 0 keeps the source and 1 returns the target
 * @returns {string} CSS rgb() color
 */
const mixColor = (hex: string, target: [number, number, number], amount: number): string => {
    const [red, green, blue] = hexToRgb(hex);
    const mix = (from: number, to: number): number => Math.round(from + (to - from) * amount);

    return `rgb(${mix(red, target[0])},${mix(green, target[1])},${mix(blue, target[2])})`;
};

/**
 * Create a cubic bezier easing function over the unit square
 * @param {number} x1 - First control point x
 * @param {number} y1 - First control point y
 * @param {number} x2 - Second control point x
 * @param {number} y2 - Second control point y
 * @returns {(progress: number) => number} Eased progress for a linear input in [0, 1]
 */
const createCubicBezier = (x1: number, y1: number, x2: number, y2: number): ((progress: number) => number) => {
    const sampleX = (time: number): number => {
        const inverse = 1 - time;
        return 3 * inverse * inverse * time * x1 + 3 * inverse * time * time * x2 + time * time * time;
    };

    const sampleY = (time: number): number => {
        const inverse = 1 - time;
        return 3 * inverse * inverse * time * y1 + 3 * inverse * time * time * y2 + time * time * time;
    };

    return (progress: number): number => {
        let low = 0;
        let high = 1;

        for (let index = 0; index < 24; index++) {
            const middle = (low + high) / 2;
            if (sampleX(middle) < progress) {
                low = middle;
            } else {
                high = middle;
            }
        }

        return sampleY((low + high) / 2);
    };
};

/**
 * Reel easing tuned to start fast and decelerate into the landing
 */
const reelEasing = createCubicBezier(0.05, 0.7, 0.12, 1);

/**
 * Render one item card with the rarity gradient, artwork, and border
 * @param {Image} image - Item artwork
 * @param {string} rarityColor - Rarity palette color
 * @param {boolean} highlighted - Draw the brighter winner border
 * @returns {Canvas} Rendered card
 */
const createItemCell = (image: Image, rarityColor: string, highlighted: boolean): Canvas => {
    const canvas = createCanvas(CELL_WIDTH, CELL_HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(1, 1, CELL_WIDTH - 2, CELL_HEIGHT - 2, CELL_RADIUS);
    ctx.clip();

    const gradient = ctx.createLinearGradient(0, 0, 0, CELL_HEIGHT);
    gradient.addColorStop(0, mixColor(rarityColor, CARD_DARK, 0.86));
    gradient.addColorStop(0.55, mixColor(rarityColor, CARD_DARK, 0.6));
    gradient.addColorStop(1, mixColor(rarityColor, CARD_DARK, 0.1));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CELL_WIDTH, CELL_HEIGHT);

    const areaWidth = CELL_WIDTH - CELL_IMAGE_PADDING_X;
    const areaHeight = CELL_HEIGHT - CELL_IMAGE_PADDING_Y;
    const scale = Math.max(areaWidth / image.width, areaHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    ctx.drawImage(image, CELL_IMAGE_PADDING_X / 2 + (areaWidth - width) / 2, CELL_IMAGE_PADDING_Y / 2 + (areaHeight - height) / 2, width, height);
    ctx.restore();

    ctx.beginPath();
    ctx.roundRect(1, 1, CELL_WIDTH - 2, CELL_HEIGHT - 2, CELL_RADIUS);
    ctx.strokeStyle = highlighted ? '#ffffff' : rarityColor;
    ctx.lineWidth = highlighted ? HIGHLIGHT_BORDER_WIDTH : BORDER_WIDTH;
    ctx.globalAlpha = highlighted ? 1 : 0.85;
    ctx.stroke();

    return canvas;
};

/**
 * Render the dark reel background with a subtle top light and bottom shadow
 * @returns {Canvas} Background layer
 */
const createBackground = (): Canvas => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    return canvas;
};

/**
 * Render the center marker that the reel lands on
 * @returns {Canvas} Marker layer
 */
const createMarker = (): Canvas => {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    const centerX = WIDTH / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(centerX - MARKER_SIZE / 2, 0);
    ctx.lineTo(centerX + MARKER_SIZE / 2, 0);
    ctx.lineTo(centerX, MARKER_SIZE);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(centerX - MARKER_SIZE / 2, HEIGHT - 1);
    ctx.lineTo(centerX + MARKER_SIZE / 2, HEIGHT - 1);
    ctx.lineTo(centerX, HEIGHT - MARKER_SIZE - 1);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fill();

    return canvas;
};

/**
 * Render the edge fades that hide reel seams at the viewport borders
 * @returns {[Canvas, Canvas]} Left and right fade layers
 */
const createEdgeFades = (): [Canvas, Canvas] => {
    const create = (flipped: boolean): Canvas => {
        const canvas = createCanvas(FADE_WIDTH, HEIGHT);
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(flipped ? FADE_WIDTH : 0, 0, flipped ? 0 : FADE_WIDTH, 0);
        gradient.addColorStop(0, BACKGROUND_COLOR);
        gradient.addColorStop(1, 'rgba(21,23,29,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, FADE_WIDTH, HEIGHT);

        return canvas;
    };

    return [create(false), create(true)];
};

/**
 * Build a shared palette from every card of a case plus the reel furniture
 * @param {Canvas[]} cells - Rendered item cards
 * @param {Canvas} background - Reel background
 * @param {Canvas} marker - Center marker
 * @param {Canvas} fadeLeft - Left edge fade
 * @param {Canvas} fadeRight - Right edge fade
 * @returns {GifPalette} GIF color table shared by every frame
 */
const createPalette = (cells: Canvas[], background: Canvas, marker: Canvas, fadeLeft: Canvas, fadeRight: Canvas): GifPalette => {
    const columns = Math.ceil(WIDTH / CELL_SPACING);
    const rows = Math.ceil(cells.length / columns);
    const montage = createCanvas(WIDTH, rows * CELL_HEIGHT + CELL_Y * 2);
    const ctx = montage.getContext('2d');

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, montage.width, montage.height);
    ctx.drawImage(background, 0, 0);

    cells.forEach((cell, index) => {
        ctx.drawImage(cell, (index % columns) * CELL_SPACING, CELL_Y + Math.floor(index / columns) * CELL_HEIGHT);
    });

    ctx.drawImage(fadeLeft, 0, 0);
    ctx.drawImage(fadeRight, WIDTH - FADE_WIDTH, 0);
    ctx.drawImage(marker, 0, 0);

    const rgba = ctx.getImageData(0, 0, montage.width, montage.height).data;

    return quantize(rgba, PALETTE_SIZE);
};


/**
 * Renders case contents as an animated unboxing GIF and static summary images
 */
export class SlotMachineRenderer {
    readonly #machine: SlotMachine;

    /**
     * Create a renderer for one case
     * @param {SlotMachine} machine - Case whose items are rendered
     */
    constructor(machine: SlotMachine) {
        this.#machine = machine;
    }

    /**
     * Total playback time of one rendered spin GIF
     */
    public get spinDurationMs(): number {
        return SPIN_DURATION_MS + LANDING_PULSE_MS + HOLD_MS;
    }

    /**
     * Build the placeholder embed shown while the GIF is generated
     * @param {string} text - Localized status line
     * @returns {EmbedBuilder} Ready-to-send embed
     */
    public buildLoadingEmbed(text: string): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(this.#machine.definition.themeColor as HexColorString)
            .setTitle(`🎰 ${this.#machine.name}`)
            .setDescription(text);
    }

    /**
     * Build the embed that shows the unboxing GIF and its result
     * @param {SpinResult} result - Resolved unboxing
     * @param {string} text - Localized status line
     * @param {string} [footer] - Optional localized session summary
     * @returns {EmbedBuilder} Ready-to-send embed referencing the GIF attachment
     */
    public buildSpinEmbed(result: SpinResult, text: string, footer?: string): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(SLOT_RARITY_COLORS[result.item.rarity] as HexColorString)
            .setTitle(`🎰 ${this.#machine.name}`)
            .setDescription(text)
            .setImage(`attachment://${SPIN_ATTACHMENT_NAME}`);

        if (footer) {
            embed.setFooter({ text: footer });
        }

        return embed;
    }

    /**
     * Build the embed summarizing several unboxings
     * @param {string} title - Localized summary title
     * @param {string[]} lines - Preformatted result lines
     * @param {string} [footer] - Optional localized session summary
     * @returns {EmbedBuilder} Ready-to-send embed referencing the summary attachment
     */
    public buildSummaryEmbed(title: string, lines: string[], footer?: string): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(this.#machine.definition.themeColor as HexColorString)
            .setTitle(`🎰 ${this.#machine.name} — ${title}`)
            .setDescription(lines.join('\n'))
            .setImage(`attachment://${SUMMARY_ATTACHMENT_NAME}`);

        if (footer) {
            embed.setFooter({ text: footer });
        }

        return embed;
    }

    /**
     * Format one unboxing as a summary line
     * @param {SpinResult} result - Unboxing to summarize
     * @param {string} rarityLabel - Localized rarity name
     * @returns {string} Item name followed by its rarity
     */
    public renderResultLine(result: SpinResult, rarityLabel: string): string {
        return `**${result.item.name}** — ${rarityLabel}`;
    }

    /**
     * Render one unboxing as an animated GIF that lands on the won item
     * @param {SpinResult} result - Resolved unboxing with reel and winner index
     * @returns {Promise<Buffer>} Encoded GIF bytes
     */
    public async renderSpinGif(result: SpinResult): Promise<Buffer> {
        const assets = await this.#assets();
        const cells = result.reel.map(item => this.#cellFor(assets, item));
        const winnerCell = this.#highlightedCell(assets, result.item);

        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext('2d');
        const gif = GIFEncoder();

        const frameDelay = Math.round(1000 / FRAME_RATE);
        const motionFrames = Math.round(SPIN_DURATION_MS / frameDelay);
        const pulseFrames = Math.round(LANDING_PULSE_MS / frameDelay);
        const holdFrames = Math.round(HOLD_MS / HOLD_FRAME_DELAY_MS);

        const jitter = (Math.random() - 0.5) * CELL_SPACING * WINNER_JITTER_RATIO;
        const finalOffset = result.winnerIndex * CELL_SPACING + CELL_SPACING / 2 - WIDTH / 2 + jitter;
        const winnerX = result.winnerIndex * CELL_SPACING - finalOffset;

        for (let index = 0; index < motionFrames; index++) {
            const progress = index / (motionFrames - 1);
            this.#drawReel(ctx, assets, cells, Math.round(reelEasing(progress) * finalOffset));
            this.#encodeFrame(gif, ctx, assets.palette, frameDelay, index === 0);
        }

        const pulseSteps = Math.max(1, pulseFrames - 1);
        for (let index = 0; index < pulseFrames; index++) {
            const scale = 1 + Math.sin((index / pulseSteps) * Math.PI) * LANDING_PULSE_SCALE;
            this.#drawReel(ctx, assets, cells, Math.round(finalOffset));
            this.#drawWinner(ctx, winnerCell, winnerX, scale);
            this.#encodeFrame(gif, ctx, assets.palette, frameDelay, false);
        }

        this.#drawReel(ctx, assets, cells, Math.round(finalOffset));
        this.#drawWinner(ctx, winnerCell, winnerX, 1);

        for (let index = 0; index < holdFrames; index++) {
            this.#encodeFrame(gif, ctx, assets.palette, HOLD_FRAME_DELAY_MS, false);
        }

        return Buffer.from(gif.bytes());
    }

    /**
     * Render several unboxings as one static row of item cards
     * @param {SpinResult[]} results - Unboxings to display
     * @returns {Promise<Buffer>} Encoded PNG bytes
     */
    public async renderSummaryImage(results: SpinResult[]): Promise<Buffer> {
        const assets = await this.#assets();
        const canvas = createCanvas(WIDTH, HEIGHT);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(assets.background, 0, 0);
        results.forEach((result, index) => {
            ctx.drawImage(this.#cellFor(assets, result.item), index * CELL_SPACING, CELL_Y);
        });

        return canvas.toBuffer('image/png');
    }

    /**
     * Load and cache the rendered assets of the case
     * @private
     */
    #assets(): Promise<CaseAssets> {
        const cached = caseAssetsCache.get(this.#machine.id);
        if (cached) return cached;

        const pending = this.#buildAssets().catch(error => {
            caseAssetsCache.delete(this.#machine.id);
            throw error;
        });
        caseAssetsCache.set(this.#machine.id, pending);

        return pending;
    }

    /**
     * Load every item image and pre-render the cards, furniture, and palette
     * @private
     */
    async #buildAssets(): Promise<CaseAssets> {
        const { items, assetDir } = this.#machine.definition;
        const loaded = await Promise.all(items.map(item => loadImage(join(ASSETS_DIRECTORY, assetDir, item.image))));

        const cells = new Map<string, Canvas>();
        const images = new Map<string, Image>();

        items.forEach((item, index) => {
            cells.set(item.id, createItemCell(loaded[index], SLOT_RARITY_COLORS[item.rarity], false));
            images.set(item.id, loaded[index]);
        });

        const background = createBackground();
        const marker = createMarker();
        const [fadeLeft, fadeRight] = createEdgeFades();

        return {
            cells,
            images,
            highlighted: new Map<string, Canvas>(),
            palette: createPalette([...cells.values()], background, marker, fadeLeft, fadeRight),
            background,
            marker,
            fadeLeft,
            fadeRight
        };
    }

    /**
     * Resolve the rendered card of one item
     * @private
     */
    #cellFor(assets: CaseAssets, item: SlotItem): Canvas {
        const cell = assets.cells.get(item.id);
        if (!cell) {
            throw new Error(`Slot machine "${this.#machine.id}" is missing a rendered cell for item "${item.id}"`);
        }

        return cell;
    }

    /**
     * Resolve the winner card, rendering the highlighted variant on first use
     * @private
     */
    #highlightedCell(assets: CaseAssets, item: SlotItem): Canvas {
        const cached = assets.highlighted.get(item.id);
        if (cached) return cached;

        const image = assets.images.get(item.id);
        if (!image) {
            throw new Error(`Slot machine "${this.#machine.id}" is missing artwork for item "${item.id}"`);
        }

        const cell = createItemCell(image, SLOT_RARITY_COLORS[item.rarity], true);
        assets.highlighted.set(item.id, cell);

        return cell;
    }

    /**
     * Draw one reel frame with the cells scrolled to the given offset
     * @private
     */
    #drawReel(ctx: SKRSContext2D, assets: CaseAssets, cells: Canvas[], offset: number): void {
        ctx.drawImage(assets.background, 0, 0);

        const firstIndex = Math.floor(offset / CELL_SPACING);
        for (let index = firstIndex; index < firstIndex + VISIBLE_CELLS; index++) {
            if (index < 0 || index >= cells.length) continue;
            ctx.drawImage(cells[index], index * CELL_SPACING - offset, CELL_Y);
        }

        ctx.drawImage(assets.fadeLeft, 0, 0);
        ctx.drawImage(assets.fadeRight, WIDTH - FADE_WIDTH, 0);
        ctx.drawImage(assets.marker, 0, 0);
    }

    /**
     * Draw the winning card scaled around its center for the landing pulse
     * @private
     */
    #drawWinner(ctx: SKRSContext2D, cell: Canvas, x: number, scale: number): void {
        const width = CELL_WIDTH * scale;
        const height = CELL_HEIGHT * scale;

        ctx.drawImage(cell, x - (width - CELL_WIDTH) / 2, CELL_Y - (height - CELL_HEIGHT) / 2, width, height);
    }

    /**
     * Index the current canvas content with the shared palette and append the frame
     * @private
     */
    #encodeFrame(gif: ReturnType<typeof GIFEncoder>, ctx: SKRSContext2D, palette: GifPalette, delay: number, first: boolean): void {
        const rgba = ctx.getImageData(0, 0, WIDTH, HEIGHT).data;
        const index = applyPalette(rgba, palette, 'rgb565');

        gif.writeFrame(index, WIDTH, HEIGHT, first ? { palette, delay, repeat: -1 } : { delay });
    }
}
