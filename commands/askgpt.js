module.exports = {
    name: "askgpt",
    description: "Talk to ChatGPT.",
    owner: false,
    usage: "`askgpt <message>`",
    async execute(message, messageObj) {
        // Hopefully this lets Discord know we're trying...
        messageObj.channel.sendTyping();

        let result;
        try {
            result = await messageObj.client.openAIAPI.sendMessage(message);
        } catch (error) {
            console.error(error);
            await messageObj.reply({
                content: "I couldn't handle your message. Try again later.",
                ephemeral: true,
            });
            return;
        }
        messageObj.reply(result.response);
    },
};
