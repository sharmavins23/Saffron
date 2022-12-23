module.exports = {
    name: "askgpt",
    description: "Talk to ChatGPT.",
    owner: false,
    usage: "`askgpt <message>`",
    async execute(message, messageObj) {
        // Hopefully this lets Discord know we're trying...
        messageObj.channel.sendTyping();

        const result = await messageObj.client.openAIAPI.sendMessage(message);
        messageObj.reply(result.response);
    },
};
