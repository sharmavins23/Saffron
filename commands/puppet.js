module.exports = {
    name: "puppet",
    description: "Control the bot to say things.",
    owner: true,
    usage: "`puppet <message>`",
    async execute(message, messageObj) {
        // Delete the original message
        await messageObj.delete();

        // Send the message
        await messageObj.channel.send(message);
    },
};
