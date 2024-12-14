import { Client, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN } from "./api/constants";

export const client = new Client({ intents: [GatewayIntentBits.Guilds]}); 

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.login(BOT_TOKEN);