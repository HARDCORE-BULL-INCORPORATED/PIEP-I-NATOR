import { EmbedBuilder } from 'discord.js';

import { SLOT_RARITY_COLORS } from './SlotMachine.types.js';

import type { HexColorString } from 'discord.js';
import type SlotMachine from './SlotMachine.js';
import type { SlotSymbol, SpinResult } from './SlotMachine.types.js';


const CODE_FENCE = '```';
const PAYLINE_PREFIX = ' ▶ ';
const EMPTY_PREFIX = '   ';
const MIN_CELL_WIDTH = 5;

/**
 * Measure how many monospace columns a reel symbol occupies.
 * Emoji render two columns wide even when they include a variation selector.
 */
const measureDisplayWidth = (display: string): number => {
    let width = 0;
    const characters = [...display];

    for (let index = 0; index < characters.length; index++) {
        const codePoint = characters[index].codePointAt(0) ?? 0;
        if (codePoint === 0xfe0f || codePoint === 0xfe0e) continue;

        const emojiPresentation = characters[index + 1] === '\ufe0f';
        width += codePoint > 0xffff || emojiPresentation ? 2 : 1;
    }

    return width;
};


/**
 * Renders slot machine spins as monospace reel grids and embeds
 */
export class SlotMachineRenderer {
    readonly #machine: SlotMachine;
    readonly #cellWidth: number;

    /**
     * Create a renderer for one slot machine
     * @param {SlotMachine} machine - Machine whose symbols and layout are rendered
     */
    constructor(machine: SlotMachine) {
        this.#machine = machine;
        this.#cellWidth = Math.max(MIN_CELL_WIDTH, ...machine.definition.symbols.map(symbol => measureDisplayWidth(symbol.display)));
    }

    /**
     * Render the visible reel window of a spin as a fenced code block
     * @param {SpinResult} result - Spin result to render
     * @returns {string} Code block containing the reel grid
     */
    public renderGrid(result: SpinResult): string {
        const visibleRows = this.#machine.definition.visibleRows;
        const paylineRow = Math.floor(visibleRows / 2);
        const segment = '─'.repeat(this.#cellWidth + 2);
        const separators = Array.from({ length: result.columns.length }, () => segment);

        const lines = [`${EMPTY_PREFIX}┌${separators.join('┬')}┐`];

        for (let row = 0; row < visibleRows; row++) {
            const cells = result.columns.map(column => this.#renderCell(column[row]));
            const prefix = row === paylineRow ? PAYLINE_PREFIX : EMPTY_PREFIX;
            lines.push(`${prefix}│${cells.join('│')}│`);
        }

        lines.push(`${EMPTY_PREFIX}└${separators.join('┴')}┘`);

        return [CODE_FENCE, ...lines, CODE_FENCE].join('\n');
    }

    /**
     * Build the embed for one spin frame
     * @param {SpinResult} result - Frame to show
     * @param {string} status - Localized status line shown below the reels
     * @param {string} [footer] - Optional localized session summary
     * @returns {EmbedBuilder} Ready-to-send embed
     */
    public buildSpinEmbed(result: SpinResult, status: string, footer?: string): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(this.#resultColor(result) as HexColorString)
            .setTitle(`🎰 ${this.#machine.name}`)
            .setDescription(`${this.renderGrid(result)}\n${status}`);

        if (footer) {
            embed.setFooter({ text: footer });
        }

        return embed;
    }

    /**
     * Build the embed summarizing several spins
     * @param {string} title - Localized summary title
     * @param {string[]} lines - Preformatted result lines
     * @param {string} [footer] - Optional localized session summary
     * @returns {EmbedBuilder} Ready-to-send embed
     */
    public buildSummaryEmbed(title: string, lines: string[], footer?: string): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(this.#machine.definition.themeColor as HexColorString)
            .setTitle(`🎰 ${this.#machine.name} — ${title}`)
            .setDescription(lines.join('\n'));

        if (footer) {
            embed.setFooter({ text: footer });
        }

        return embed;
    }

    /**
     * Format the payline of a spin as one summary line
     * @param {SpinResult} result - Spin result to summarize
     * @param {string} missLabel - Localized label used when the spin has no payout
     * @returns {string} Symbols followed by the payout or the miss label
     */
    public renderResultLine(result: SpinResult, missLabel: string): string {
        const symbols = result.payline.map(symbol => symbol.display).join(' ');

        return result.matched
            ? `${symbols} — **${result.payout}×**`
            : `${symbols} — ${missLabel}`;
    }

    /**
     * Resolve the embed color for a spin: the matched rarity or the machine theme
     * @private
     */
    #resultColor(result: SpinResult): string {
        return result.matched
            ? SLOT_RARITY_COLORS[result.matched.rarity]
            : this.#machine.definition.themeColor;
    }

    /**
     * Center one symbol inside a fixed-width cell
     * @private
     */
    #renderCell(symbol: SlotSymbol): string {
        const padding = Math.max(0, this.#cellWidth - measureDisplayWidth(symbol.display));
        const leftPadding = Math.floor(padding / 2);

        return ` ${' '.repeat(leftPadding)}${symbol.display}${' '.repeat(padding - leftPadding)} `;
    }
}
