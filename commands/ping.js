const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        // Compute the time difference between the response
        let timeDiff = Date.now() - interaction.createdTimestamp;

        await interaction.reply({
            content: `Pong! It took me ${timeDiff} ms to respond.`,
            ephemeral: true,
        });
    },
};
