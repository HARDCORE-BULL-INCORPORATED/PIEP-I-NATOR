import SlotMachine from '../SlotMachine.js';
import { mapsMachine } from './maps.js';
import { viinatMachine } from './viinat.js';

import type { SlotMachineChoice } from '../SlotMachine.types.js';


/**
 * Every slot machine the bot can play, in display order
 */
export const slotMachines: SlotMachine[] = [
    new SlotMachine(viinatMachine),
    new SlotMachine(mapsMachine)
];

/**
 * Get every registered slot machine
 * @returns {SlotMachine[]} All machines in display order
 */
export function getAllSlotMachines(): SlotMachine[] {
    return slotMachines;
}

/**
 * Find a slot machine by id, case-insensitively
 * @param {string} id - Machine id entered by the user
 * @returns {SlotMachine | null} The matching machine or null when unknown
 */
export function getSlotMachine(id: string): SlotMachine | null {
    const normalizedId = id.trim().toLowerCase();
    return slotMachines.find(machine => machine.id.toLowerCase() === normalizedId) ?? null;
}

/**
 * Get the machine used when the command runs without a selection
 * @returns {SlotMachine} Default machine
 */
export function getDefaultSlotMachine(): SlotMachine {
    return slotMachines[0];
}

/**
 * Build slash command choices for every machine
 * @returns {SlotMachineChoice[]} Choices accepted by the command option
 */
export function getSlotMachineChoices(): SlotMachineChoice[] {
    return slotMachines.map(machine => ({ name: machine.name, value: machine.id }));
}
