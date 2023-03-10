const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const ChatGPT = import("chatgpt");
require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// ===== OpenAI handling =======================================================

async function setupChatGPTAPI() {
    // Use Puppeteer to bypass Cloudflare
    client.openAIAPI = new (await ChatGPT).ChatGPTAPIBrowser({
        email: process.env.OPENAI_EMAIL,
        password: process.env.OPENAI_PASSWORD,
        isGoogleLogin: true,
    });

    await client.openAIAPI.initSession();
}

setupChatGPTAPI();

// ===== Command handling ======================================================

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    return file.endsWith(".js");
});

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (
        "name" in command &&
        "description" in command &&
        "owner" in command &&
        "usage" in command &&
        "execute" in command
    ) {
        client.commands.set(command.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

client.slashCommands = new Collection();

const slashCommandsPath = path.join(__dirname, "commands/commands");
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter((file) => {
    return file.endsWith(".js");
});

for (const file of slashCommandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
        client.slashCommands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
    }
}

// ===== Event handling ========================================================

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => {
    return file.endsWith(".js");
});

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => {
            event.execute(...args);
        });
    } else {
        client.on(event.name, (...args) => {
            event.execute(...args);
        });
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);
