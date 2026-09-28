/**
 * Rarity tiers ordered from most to least common, matching the Counter-Strike case palette
 */
export enum SlotRarity {
    CONSUMER = 'CONSUMER',
    INDUSTRIAL = 'INDUSTRIAL',
    MIL_SPEC = 'MIL_SPEC',
    RESTRICTED = 'RESTRICTED',
    CLASSIFIED = 'CLASSIFIED',
    COVERT = 'COVERT',
    RARE_SPECIAL = 'RARE_SPECIAL',
    CONTRABAND = 'CONTRABAND',
}

/**
 * Rarity tiers from most to least common, used to rank unboxed loot
 */
export const SLOT_RARITY_ORDER: SlotRarity[] = [
    SlotRarity.CONSUMER,
    SlotRarity.INDUSTRIAL,
    SlotRarity.MIL_SPEC,
    SlotRarity.RESTRICTED,
    SlotRarity.CLASSIFIED,
    SlotRarity.COVERT,
    SlotRarity.RARE_SPECIAL,
    SlotRarity.CONTRABAND,
];

/**
 * Embed and item card colors per rarity tier, matching the Counter-Strike palette
 */
export const SLOT_RARITY_COLORS: Record<SlotRarity, string> = {
    [SlotRarity.CONSUMER]: '#b0c3d9',
    [SlotRarity.INDUSTRIAL]: '#5e98d9',
    [SlotRarity.MIL_SPEC]: '#4b69ff',
    [SlotRarity.RESTRICTED]: '#8847ff',
    [SlotRarity.CLASSIFIED]: '#d32ce6',
    [SlotRarity.COVERT]: '#eb4b4b',
    [SlotRarity.RARE_SPECIAL]: '#e4ae39',
    [SlotRarity.CONTRABAND]: '#f19b1d',
};

/**
 * Localization keys for the rarity labels
 */
export const SLOT_RARITY_LABEL_KEYS: Record<SlotRarity, string> = {
    [SlotRarity.CONSUMER]: 'MESSAGE_SLOT_RARITY_CONSUMER',
    [SlotRarity.INDUSTRIAL]: 'MESSAGE_SLOT_RARITY_INDUSTRIAL',
    [SlotRarity.MIL_SPEC]: 'MESSAGE_SLOT_RARITY_MIL_SPEC',
    [SlotRarity.RESTRICTED]: 'MESSAGE_SLOT_RARITY_RESTRICTED',
    [SlotRarity.CLASSIFIED]: 'MESSAGE_SLOT_RARITY_CLASSIFIED',
    [SlotRarity.COVERT]: 'MESSAGE_SLOT_RARITY_COVERT',
    [SlotRarity.RARE_SPECIAL]: 'MESSAGE_SLOT_RARITY_RARE_SPECIAL',
    [SlotRarity.CONTRABAND]: 'MESSAGE_SLOT_RARITY_CONTRABAND',
};

/**
 * One item that can be unboxed from a case
 */
export interface SlotItem {
    readonly id: string;
    readonly name: string;
    readonly image: string;
    readonly weight: number;
    readonly rarity: SlotRarity;
}

/**
 * Static configuration of one case that can be opened
 */
export interface SlotMachineDefinition {
    readonly id: string;
    readonly name: string;
    /** Directory under the renderer assets holding the item images */
    readonly assetDir: string;
    readonly themeColor: string;
    readonly items: SlotItem[];
}

/**
 * Outcome of a single unboxing: the won item and the reel that is animated for it
 */
export interface SpinResult {
    readonly item: SlotItem;
    readonly reel: SlotItem[];
    readonly winnerIndex: number;
}

/**
 * Slash command choice used to select a case
 */
export interface SlotMachineChoice {
    readonly name: string;
    readonly value: string;
}
