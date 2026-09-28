import { SLOT_RARITY_COLORS } from './SlotMachine.types.js';

import type { SlotMachineDefinition, SlotSymbol, SpinResult } from './SlotMachine.types.js';


const MIN_REELS = 3;
const MAX_REELS = 5;
const VISIBLE_ROW_OPTIONS = [1, 3, 5];
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;


/**
 * Weighted slot machine engine that resolves spins for a machine definition
 */
export default class SlotMachine {
    readonly #definition: SlotMachineDefinition;
    readonly #totalWeight: number;

    /**
     * Create a slot machine from a validated definition
     * @param {SlotMachineDefinition} definition - Machine symbols, payouts, and layout
     * @throws {TypeError} When the definition or one of its fields has an invalid type
     * @throws {RangeError} When the definition has an invalid layout, weight, or payout
     */
    constructor(definition: SlotMachineDefinition) {
        SlotMachine.checkOptions(definition);
        this.#definition = definition;
        this.#totalWeight = definition.symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
    }

    /**
     * Validate a machine definition before it is used
     * @param {SlotMachineDefinition} definition - Machine definition to validate
     */
    public static checkOptions(definition: SlotMachineDefinition): void {
        if (typeof definition !== 'object' || definition === null) {
            throw new TypeError('Slot machine definition must be an object');
        }

        if (typeof definition.id !== 'string' || definition.id.trim().length === 0) {
            throw new TypeError('Slot machine id must be a non-empty string');
        }

        if (typeof definition.name !== 'string' || definition.name.trim().length === 0) {
            throw new TypeError(`Slot machine "${definition.id}" must have a non-empty name`);
        }

        if (!Number.isInteger(definition.reels) || definition.reels < MIN_REELS || definition.reels > MAX_REELS) {
            throw new RangeError(`Slot machine "${definition.id}" must have between ${MIN_REELS} and ${MAX_REELS} reels`);
        }

        if (!VISIBLE_ROW_OPTIONS.includes(definition.visibleRows)) {
            throw new RangeError(`Slot machine "${definition.id}" visibleRows must be one of ${VISIBLE_ROW_OPTIONS.join(', ')}`);
        }

        if (typeof definition.themeColor !== 'string' || !HEX_COLOR_PATTERN.test(definition.themeColor)) {
            throw new TypeError(`Slot machine "${definition.id}" themeColor must be a hex color such as #ffffff`);
        }

        if (!Array.isArray(definition.symbols) || definition.symbols.length < 2) {
            throw new TypeError(`Slot machine "${definition.id}" must define at least two symbols`);
        }

        const symbolIds = new Set<string>();
        let totalWeight = 0;

        for (const symbol of definition.symbols) {
            SlotMachine.#checkSymbol(definition.id, symbol, symbolIds);
            totalWeight += symbol.weight;
        }

        if (totalWeight <= 0) {
            throw new RangeError(`Slot machine "${definition.id}" must have a positive total symbol weight`);
        }
    }

    /**
     * Validate one symbol and track its id for duplicate detection
     * @private
     */
    static #checkSymbol(machineId: string, symbol: SlotSymbol, symbolIds: Set<string>): void {
        if (typeof symbol.id !== 'string' || symbol.id.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" has a symbol without an id`);
        }

        if (symbolIds.has(symbol.id)) {
            throw new TypeError(`Slot machine "${machineId}" has a duplicate symbol id "${symbol.id}"`);
        }
        symbolIds.add(symbol.id);

        if (typeof symbol.name !== 'string' || symbol.name.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" symbol "${symbol.id}" must have a non-empty name`);
        }

        if (typeof symbol.display !== 'string' || symbol.display.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" symbol "${symbol.id}" must have a non-empty display`);
        }

        if (!Number.isFinite(symbol.weight) || symbol.weight < 0) {
            throw new RangeError(`Slot machine "${machineId}" symbol "${symbol.id}" weight must be a non-negative number`);
        }

        if (!Number.isFinite(symbol.payout) || symbol.payout < 0) {
            throw new RangeError(`Slot machine "${machineId}" symbol "${symbol.id}" payout must be a non-negative number`);
        }

        if (!(symbol.rarity in SLOT_RARITY_COLORS)) {
            throw new TypeError(`Slot machine "${machineId}" symbol "${symbol.id}" has an unknown rarity "${symbol.rarity}"`);
        }
    }

    /**
     * Machine id used by the command and registry
     */
    public get id(): string {
        return this.#definition.id;
    }

    /**
     * Display name shown in embed titles and command choices
     */
    public get name(): string {
        return this.#definition.name;
    }

    /**
     * Immutable machine definition
     */
    public get definition(): SlotMachineDefinition {
        return this.#definition;
    }

    /**
     * Resolve one spin including the payline and its payout
     * @returns {SpinResult} Reel window, payline symbols, and matched payout
     */
    public spin(): SpinResult {
        const { reels, visibleRows } = this.#definition;
        const columns = Array.from({ length: reels }, () =>
            Array.from({ length: visibleRows }, () => this.#pickSymbol())
        );

        const paylineRow = Math.floor(visibleRows / 2);
        const payline = columns.map(column => column[paylineRow]);
        const matched = payline.every(symbol => symbol.id === payline[0].id) ? payline[0] : null;

        return {
            columns,
            payline,
            matched,
            payout: matched?.payout ?? 0
        };
    }

    /**
     * Pick one symbol using the machine weights
     * @private
     */
    #pickSymbol(): SlotSymbol {
        let threshold = Math.random() * this.#totalWeight;

        for (const symbol of this.#definition.symbols) {
            threshold -= symbol.weight;
            if (threshold < 0) return symbol;
        }

        return this.#definition.symbols[this.#definition.symbols.length - 1];
    }
}
