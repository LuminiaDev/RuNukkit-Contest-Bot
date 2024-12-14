import { Client, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN } from "./api/constants";
import { registerCommands } from "./command";

export const client = new Client({ intents: [GatewayIntentBits.Guilds]}); 

client.once('ready', () => {
    console.log('Bot is ready!');
});

registerCommands(client);

client.on('error', error => {
    console.error(error);
});

client.login(BOT_TOKEN);