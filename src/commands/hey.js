const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hey')
        .setDescription('Replies with hey there!'),
    async execute(interaction, client) {
        await interaction.reply({ content: `Hey there ${interaction.user.username}!` });
    },
};