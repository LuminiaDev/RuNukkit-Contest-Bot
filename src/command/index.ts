import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { AsyncCommand, BotCommand } from "./command";
import { BOT_CLIENT_ID, BOT_TOKEN } from "../api/constants";
import { locale } from "../locale";
import * as fs from 'fs';
import path from "path";

/**
 * Directory with all command classes
 */
export const commandsDir = path.join(__dirname, 'commands');

export async function registerCommands(client: Client) {
    const files = fs.readdirSync(commandsDir);
    
    const commandBuilders: SlashCommandBuilder[] = [];
    const commandByName: Record<string, BotCommand> = {};

    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const filePath = path.join(commandsDir, file);
        
            const CommandClass = (await import(filePath)).default;
            if (CommandClass) {
                const commandInstance: BotCommand = new CommandClass();
                const commandBuilder = commandInstance.getBuilder(locale);

                commandBuilders.push(commandBuilder);
                commandByName[commandBuilder.name] = commandInstance;
            }
        }
    }

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) {
            return;
        }
        const command = commandByName[interaction.commandName];
        if (!command) {
            return;
        }
        command.execute(interaction, locale.getLocale(interaction.locale.substring(0, 2)));
    });

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    await rest.put(Routes.applicationCommands(BOT_CLIENT_ID), {
        body: commandBuilders,
    });
}

export { BotCommand, AsyncCommand }