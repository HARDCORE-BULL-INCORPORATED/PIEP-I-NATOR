import { SlotRarity } from '../SlotMachine.types.js';

import type { SlotItem, SlotMachineDefinition } from '../SlotMachine.types.js';


const consumerGradeItems: SlotItem[] = [
    { id: 'smirnoff', name: 'Smirnoff', image: 'smirnoff.jpg', weight: 1, rarity: SlotRarity.CONSUMER }
];

const industrialGradeItems: SlotItem[] = [
    { id: 'finlandia', name: 'Finlandia', image: 'finlandia.jpg', weight: 1, rarity: SlotRarity.INDUSTRIAL }
];

const milSpecItems: SlotItem[] = [
    { id: 'koskenkorva-38', name: 'Koskenkorva 38%', image: 'koskenkorva-38.jpg', weight: 1, rarity: SlotRarity.MIL_SPEC },
    { id: 'leijona', name: 'Leijona', image: 'leijona.jpg', weight: 1, rarity: SlotRarity.MIL_SPEC },
    { id: 'suomi-viina', name: 'Suomi Viina', image: 'suomi-viina.jpg', weight: 1, rarity: SlotRarity.MIL_SPEC },
    { id: 'saunalahden-viina', name: 'Saunalahden Viina', image: 'saunalahden-viina.jpg', weight: 1, rarity: SlotRarity.MIL_SPEC }
];

const restrictedItems: SlotItem[] = [
    { id: 'puolustuslaitos', name: 'Puolustuslaitos', image: 'puolustuslaitos.jpg', weight: 1, rarity: SlotRarity.RESTRICTED },
    { id: 'koskenkorva-40', name: 'Koskenkorva 40%', image: 'koskenkorva-40.jpg', weight: 1, rarity: SlotRarity.RESTRICTED },
    { id: 'jallu', name: 'Jallu', image: 'jaloviina.jpg', weight: 1, rarity: SlotRarity.RESTRICTED }
];

const classifiedItems: SlotItem[] = [
    { id: 'saaremaa', name: 'Saaremaa', image: 'saaremaa.jpg', weight: 1, rarity: SlotRarity.CLASSIFIED },
    { id: 'tapio', name: 'Tapio', image: 'tapio-39.jpg', weight: 1, rarity: SlotRarity.CLASSIFIED }
];

const covertItems: SlotItem[] = [
    { id: 'dry-vodka', name: 'Dry Vodka', image: 'dry-vodka.jpg', weight: 1, rarity: SlotRarity.COVERT },
    { id: 'sisuviina', name: 'Sisuviina', image: 'sisuviina.jpg', weight: 1, rarity: SlotRarity.COVERT }
];

const rareSpecialItems: SlotItem[] = [
    { id: 'kossu-60', name: 'Koskenkorva 60%', image: 'kossu-60.jpg', weight: 0.5, rarity: SlotRarity.RARE_SPECIAL }
];

const contrabandItems: SlotItem[] = [
    { id: '762-viina', name: '762 Viina', image: '762-viina.jpg', weight: 0.08, rarity: SlotRarity.CONTRABAND }
];


/**
 * Viina case built around Finnish booze classics
 */
export const viinatMachine: SlotMachineDefinition = {
    id: 'viinat',
    name: 'Viina-Laatikko',
    assetDir: 'viinat',
    themeColor: '#e4ae39',
    items: [
        ...consumerGradeItems,
        ...industrialGradeItems,
        ...milSpecItems,
        ...restrictedItems,
        ...classifiedItems,
        ...covertItems,
        ...rareSpecialItems,
        ...contrabandItems
    ]
};
