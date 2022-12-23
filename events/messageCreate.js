const { Events, CommandInteraction } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // Return if the message doesn't mention the bot
        if (!message.mentions.has(message.client.user)) return;

        // Strip the message of the mention at the start
        let content;
        try {
            content = message.content.slice(
                message.mentions.users.first().toString().length + 1
            );
        } catch (error) {
            console.error(error);
            await message.reply({
                content: `Some internal error happened when you tried to use the bot. Please try again later.`,
                ephemeral: true,
            });

            return;
        }
        // Get the first word of the message to find the command
        let commandName = content.split(" ")[0];
        commandName = commandName.toLowerCase();
        // Remove the command from the message
        content = content.slice(commandName.length + 1);

        // Find a matching command for the content
        const command = message.client.commands.get(commandName);

        if (!command) {
            console.error(`No command matching "${commandName}" was found.`);
            await message.reply({
                content: `I don't know that command!`,
                ephemeral: true,
            });
            return;
        }

        // Check if the command is owner only
        if (
            command.owner &&
            message.author.id !== process.env.DISCORD_OWNER_ID
        ) {
            await message.reply({
                content: "You don't have permission to use this command!",
                ephemeral: true,
            });
            return;
        }

        try {
            await command.execute(content, message);
        } catch (error) {
            console.error(error);
            await message.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
