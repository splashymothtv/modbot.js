const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hey')
        .setDescription('Replies with hey there!'),
    async execute(interaction, client) {
        return interaction.reply(`Hey there ${interaction.user.username}!`)
    },
};