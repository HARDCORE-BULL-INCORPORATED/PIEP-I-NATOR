import i18next from 'i18next';

import { BaseCommand } from './base/BaseCommand.js';
import { CommandCategory } from '../@types/index.js';
import { embeds } from '../embeds/index.js';

import type { Client } from 'discord.js';
import type { CommandContext } from './base/CommandContext.js';
import type { Bot, CommandMetadata } from '../@types/index.js';


export class HelpCommand extends BaseCommand {
    public getMetadata(_bot: Bot, lng?: string): CommandMetadata {
        return {
            name: 'help',
            aliases: ['h'],
            description: i18next.t('commands:CONFIG_HELP_DESCRIPTION', { lng }),
            usage: i18next.t('commands:CONFIG_HELP_USAGE', { lng }),
            category: CommandCategory.UTILITY,
            voiceChannel: false,
            showHelp: true,
            sendTyping: true,
            options: [
                {
                    name: 'command',
                    description: i18next.t('commands:CONFIG_HELP_OPTION_DESCRIPTION', { lng }),
                    type: 3,
                    required: false
                }
            ]
        };
    }

    protected async run(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        // Get command parameter
        const commandParam = context.isInteraction()
            ? context.getStringOption('command')
            : context.args.join(' ');

        if (!commandParam) {
            // Show the command list
            await this.#showCommandList(bot, client, context);
        }
        else {
            // Show specific command help
            await this.#showCommandHelp(bot, client, context, commandParam);
        }
    }

    /**
     * Show the list of all commands grouped by category
     * @private
     */
    async #showCommandList(bot: Bot, client: Client, context: CommandContext): Promise<void> {
        const metadata = client.commands
            .getHelpCommands(bot, context.language)
            .map(cmd => cmd.getMetadata(bot, context.language));

        const sections = Object.values(CommandCategory)
            .map(category => ({
                category,
                lines: metadata
                    .filter(entry => entry.category === category)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(entry => this.#formatCommandLine(bot.config.bot.prefix, entry))
            }))
            .filter(section => section.lines.length > 0);

        await context.reply({
            embeds: [embeds.helpList(bot, sections, context.language)],
            allowedMentions: { repliedUser: false }
        });
    }

    /**
     * Format a command as a single overview line
     * @private
     */
    #formatCommandLine(prefix: string, metadata: CommandMetadata): string {
        const aliases = metadata.aliases.length > 0
            ? ` (${metadata.aliases.join(', ')})`
            : '';

        return `**${prefix}${metadata.name}**${aliases} - ${metadata.description}`;
    }

    /**
     * Show specific command help
     * @private
     */
    async #showCommandHelp(bot: Bot, client: Client, context: CommandContext, commandName: string): Promise<void> {
        const prefix = bot.config.bot.prefix;
        const commands = client.commands.getHelpCommands(bot, context.language);

        let found = false;
        for (const cmd of commands) {
            const metadata = cmd.getMetadata(bot, context.language);
            if (commandName === metadata.name || (metadata.aliases && metadata.aliases.includes(commandName))) {
                const description = `${metadata.description}\n\`\`\`${prefix}${metadata.usage}\`\`\``;

                await context.reply({
                    embeds: [embeds.help(bot, metadata.name, description, context.language)],
                    allowedMentions: { repliedUser: false }
                });

                found = true;
                break;
            }
        }

        if (!found) {
            await context.reply({
                embeds: [embeds.textErrorMsg(bot, context.t('commands:MESSAGE_HELP_NOT_FOUND'))],
                allowedMentions: { repliedUser: false }
            });
        }
    }
}
