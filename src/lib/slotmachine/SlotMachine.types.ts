/**
 * Symbol rarity tiers ordered from most to least common
 */
export enum SlotRarity {
    COMMON = 'COMMON',
    UNCOMMON = 'UNCOMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
}

/**
 * Embed colors per rarity tier, reused from the roulette rarity palette
 */
export const SLOT_RARITY_COLORS: Record<SlotRarity, string> = {
    [SlotRarity.COMMON]: '#b0c3d9',
    [SlotRarity.UNCOMMON]: '#4b69ff',
    [SlotRarity.RARE]: '#8847ff',
    [SlotRarity.EPIC]: '#d32ce6',
    [SlotRarity.LEGENDARY]: '#e4ae39',
};

/**
 * One distinct symbol that can appear on a reel
 */
export interface SlotSymbol {
    readonly id: string;
    readonly name: string;
    readonly display: string;
    readonly weight: number;
    readonly payout: number;
    readonly rarity: SlotRarity;
}

/**
 * Static configuration of one slot machine
 */
export interface SlotMachineDefinition {
    readonly id: string;
    readonly name: string;
    readonly reels: number;
    readonly visibleRows: 1 | 3 | 5;
    readonly symbols: SlotSymbol[];
    readonly themeColor: string;
}

/**
 * Outcome of a single spin
 */
export interface SpinResult {
    readonly columns: SlotSymbol[][];
    readonly payline: SlotSymbol[];
    readonly matched: SlotSymbol | null;
    readonly payout: number;
}

/**
 * Slash command choice used to select a slot machine
 */
export interface SlotMachineChoice {
    readonly name: string;
    readonly value: string;
}
