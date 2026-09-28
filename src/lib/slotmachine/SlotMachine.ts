import { SLOT_RARITY_COLORS } from './SlotMachine.types.js';

import type { SlotItem, SlotMachineDefinition, SpinResult } from './SlotMachine.types.js';


const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const REEL_LENGTH = 34;
const WINNER_INDEX_MIN_RATIO = 0.7;
const WINNER_INDEX_SPAN_RATIO = 0.2;


/**
 * Weighted case opening engine that resolves unboxings for a case definition
 */
export default class SlotMachine {
    readonly #definition: SlotMachineDefinition;
    readonly #totalWeight: number;

    /**
     * Create a case from a validated definition
     * @param {SlotMachineDefinition} definition - Case items, weights, and theme
     * @throws {TypeError} When the definition or one of its fields has an invalid type
     * @throws {RangeError} When the definition has an invalid weight or empty item pool
     */
    constructor(definition: SlotMachineDefinition) {
        SlotMachine.checkOptions(definition);
        this.#definition = definition;
        this.#totalWeight = definition.items.reduce((sum, item) => sum + item.weight, 0);
    }

    /**
     * Validate a case definition before it is used
     * @param {SlotMachineDefinition} definition - Case definition to validate
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

        if (typeof definition.assetDir !== 'string' || definition.assetDir.trim().length === 0) {
            throw new TypeError(`Slot machine "${definition.id}" must have a non-empty asset directory`);
        }

        if (typeof definition.themeColor !== 'string' || !HEX_COLOR_PATTERN.test(definition.themeColor)) {
            throw new TypeError(`Slot machine "${definition.id}" themeColor must be a hex color such as #ffffff`);
        }

        if (!Array.isArray(definition.items) || definition.items.length < 2) {
            throw new TypeError(`Slot machine "${definition.id}" must define at least two items`);
        }

        const itemIds = new Set<string>();
        let totalWeight = 0;

        for (const item of definition.items) {
            SlotMachine.#checkItem(definition.id, item, itemIds);
            totalWeight += item.weight;
        }

        if (totalWeight <= 0) {
            throw new RangeError(`Slot machine "${definition.id}" must have a positive total item weight`);
        }
    }

    /**
     * Validate one item and track its id for duplicate detection
     * @private
     */
    static #checkItem(machineId: string, item: SlotItem, itemIds: Set<string>): void {
        if (typeof item.id !== 'string' || item.id.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" has an item without an id`);
        }

        if (itemIds.has(item.id)) {
            throw new TypeError(`Slot machine "${machineId}" has a duplicate item id "${item.id}"`);
        }
        itemIds.add(item.id);

        if (typeof item.name !== 'string' || item.name.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" item "${item.id}" must have a non-empty name`);
        }

        if (typeof item.image !== 'string' || item.image.trim().length === 0) {
            throw new TypeError(`Slot machine "${machineId}" item "${item.id}" must have a non-empty image`);
        }

        if (!Number.isFinite(item.weight) || item.weight < 0) {
            throw new RangeError(`Slot machine "${machineId}" item "${item.id}" weight must be a non-negative number`);
        }

        if (!(item.rarity in SLOT_RARITY_COLORS)) {
            throw new TypeError(`Slot machine "${machineId}" item "${item.id}" has an unknown rarity "${item.rarity}"`);
        }
    }

    /**
     * Case id used by the command and registry
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
     * Immutable case definition
     */
    public get definition(): SlotMachineDefinition {
        return this.#definition;
    }

    /**
     * Resolve one unboxing: the won item plus the reel that lands on it
     * @returns {SpinResult} Won item, reel items, and the winner index inside the reel
     */
    public spin(): SpinResult {
        const winnerIndex = Math.floor(REEL_LENGTH * WINNER_INDEX_MIN_RATIO)
            + Math.floor(Math.random() * Math.floor(REEL_LENGTH * WINNER_INDEX_SPAN_RATIO));
        const reel = Array.from({ length: REEL_LENGTH }, () => this.#pickItem());
        const item = this.#pickItem();
        reel[winnerIndex] = item;

        return { item, reel, winnerIndex };
    }

    /**
     * Pick one item using the case weights
     * @private
     */
    #pickItem(): SlotItem {
        let threshold = Math.random() * this.#totalWeight;

        for (const item of this.#definition.items) {
            threshold -= item.weight;
            if (threshold < 0) return item;
        }

        return this.#definition.items[this.#definition.items.length - 1];
    }
}
