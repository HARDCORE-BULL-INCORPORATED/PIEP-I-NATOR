/**
 * Command category enumeration
 */
export enum CommandCategory {
    MUSIC = 'Music',
    UTILITY = 'Utility',
    GAMES = 'Games'
}

/**
 * Command metadata interface
 */
export interface CommandMetadata {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    category: CommandCategory;
    voiceChannel: boolean;
    showHelp: boolean;
    sendTyping: boolean;
    options: any[];
}