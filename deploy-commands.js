const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
require("dotenv").config();

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter((file) => {
    return file.endsWith(".js");
});

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN
);

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.DISCORD_BOT_CLIENT_ID,
                process.env.DISCORD_TESTING_SERVER_ID
            ),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
