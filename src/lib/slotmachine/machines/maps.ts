import { SlotRarity } from '../SlotMachine.types.js';

import type { SlotItem, SlotMachineDefinition } from '../SlotMachine.types.js';


const consumerGradeItems: SlotItem[] = [
    { id: 'dust2', name: 'Dust II', image: 'de_dust2.png', weight: 1, rarity: SlotRarity.CONSUMER },
    { id: 'mirage', name: 'Mirage', image: 'de_mirage.png', weight: 1, rarity: SlotRarity.CONSUMER }
];

const industrialGradeItems: SlotItem[] = [
    { id: 'inferno', name: 'Inferno', image: 'de_inferno.png', weight: 1, rarity: SlotRarity.INDUSTRIAL },
    { id: 'vertigo', name: 'Vertigo', image: 'de_vertigo.png', weight: 1, rarity: SlotRarity.INDUSTRIAL },
    { id: 'ancient', name: 'Ancient', image: 'de_ancient.png', weight: 1, rarity: SlotRarity.INDUSTRIAL },
    { id: 'golden', name: 'Golden', image: 'de_golden.webp', weight: 1, rarity: SlotRarity.INDUSTRIAL }
];

const milSpecItems: SlotItem[] = [
    { id: 'train', name: 'Train', image: 'de_train.png', weight: 1, rarity: SlotRarity.MIL_SPEC },
    { id: 'overpass', name: 'Overpass', image: 'de_overpass.png', weight: 1, rarity: SlotRarity.MIL_SPEC },
    { id: 'nuke', name: 'Nuke', image: 'de_nuke.png', weight: 1, rarity: SlotRarity.MIL_SPEC }
];

const classifiedItems: SlotItem[] = [
    { id: 'anubis', name: 'Anubis', image: 'de_anubis.png', weight: 1, rarity: SlotRarity.CLASSIFIED },
    { id: 'palacio', name: 'Palacio', image: 'de_palacio.webp', weight: 1, rarity: SlotRarity.CLASSIFIED },
    { id: 'italy', name: 'Italy', image: 'cs_italy.png', weight: 1, rarity: SlotRarity.CLASSIFIED }
];

const covertItems: SlotItem[] = [
    { id: 'agency', name: 'Agency', image: 'cs_agency.png', weight: 1, rarity: SlotRarity.COVERT }
];

const rareSpecialItems: SlotItem[] = [
    { id: 'office', name: 'Office', image: 'cs_office.png', weight: 1, rarity: SlotRarity.RARE_SPECIAL }
];


/**
 * Kartta case built around classic Counter-Strike maps
 */
export const mapsMachine: SlotMachineDefinition = {
    id: 'maps',
    name: 'Kartta-Laatikko',
    assetDir: 'maps',
    themeColor: '#5e98d9',
    items: [
        ...consumerGradeItems,
        ...industrialGradeItems,
        ...milSpecItems,
        ...classifiedItems,
        ...covertItems,
        ...rareSpecialItems
    ]
};
