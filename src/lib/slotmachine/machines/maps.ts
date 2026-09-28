import { SlotRarity } from '../SlotMachine.types.js';

import type { SlotMachineDefinition } from '../SlotMachine.types.js';


/**
 * Map-themed slot machine built around classic Counter-Strike maps
 */
export const mapsMachine: SlotMachineDefinition = {
    id: 'maps',
    name: 'Kartta-Slotti',
    reels: 3,
    visibleRows: 3,
    themeColor: '#5e98d9',
    symbols: [
        { id: 'mirage', name: 'Mirage', display: '🕌', weight: 40, payout: 1, rarity: SlotRarity.COMMON },
        { id: 'dust2', name: 'Dust II', display: '🌵', weight: 30, payout: 2, rarity: SlotRarity.COMMON },
        { id: 'inferno', name: 'Inferno', display: '🔥', weight: 20, payout: 3, rarity: SlotRarity.UNCOMMON },
        { id: 'train', name: 'Train', display: '🚂', weight: 12, payout: 6, rarity: SlotRarity.RARE },
        { id: 'nuke', name: 'Nuke', display: '☢️', weight: 8, payout: 10, rarity: SlotRarity.EPIC },
        { id: 'ancient', name: 'Ancient', display: '🏺', weight: 3, payout: 25, rarity: SlotRarity.LEGENDARY },
        { id: 'anubis', name: 'Anubis', display: '🐺', weight: 1, payout: 100, rarity: SlotRarity.LEGENDARY }
    ]
};
