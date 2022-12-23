import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once(Events.ClientReady, (bot) => {
    console.log(`Ready! Logged in as ${bot.user.tag}!`)
});

client.login(process.env.DISCORD_BOT_TOKEN);