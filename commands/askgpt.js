module.exports = {
    name: "askgpt",
    description: "Talk to ChatGPT.",
    owner: false,
    usage: "`askgpt <message>`",
    async execute(content, message) {
        // Hopefully this lets Discord know we're trying...
        message.channel.sendTyping();

        let result;
        try {
            result = await message.client.openAIAPI.sendMessage(content);
        } catch (error) {
            console.error(error);
            await message.reply({
                content:
                    "I couldn't handle your message. I can only respond to one person at a time, and there's a limit on the number of requests I can handle in an hour. Please try again later (sorry!)",
                ephemeral: true,
            });
            return;
        }

        // Limit the response to 2000 characters
        if (result.response.length > 2000) {
            result.response = result.response.slice(0, 1997);
            result.response += "...";
        }

        message.reply(result.response);
    },
};
