import { SlotRarity } from '../SlotMachine.types.js';

import type { SlotMachineDefinition } from '../SlotMachine.types.js';


/**
 * Viina-themed slot machine built around Finnish booze classics
 */
export const viinatMachine: SlotMachineDefinition = {
    id: 'viinat',
    name: 'Viina-Slotti',
    reels: 3,
    visibleRows: 3,
    themeColor: '#e4ae39',
    symbols: [
        { id: 'vesi', name: 'Vesi', display: '💧', weight: 40, payout: 1, rarity: SlotRarity.COMMON },
        { id: 'kossu', name: 'Koskenkorva', display: '🍾', weight: 30, payout: 2, rarity: SlotRarity.COMMON },
        { id: 'leijona', name: 'Leijona', display: '🦁', weight: 20, payout: 3, rarity: SlotRarity.UNCOMMON },
        { id: 'jallu', name: 'Jaloviina', display: '🥃', weight: 12, payout: 6, rarity: SlotRarity.RARE },
        { id: 'sisu', name: 'Sisuviina', display: '💪', weight: 8, payout: 10, rarity: SlotRarity.EPIC },
        { id: 'kossu60', name: 'Koskenkorva 60%', display: '🔥', weight: 3, payout: 25, rarity: SlotRarity.LEGENDARY },
        { id: 'viina762', name: '762 Viina', display: '☠️', weight: 1, payout: 100, rarity: SlotRarity.LEGENDARY }
    ]
};
