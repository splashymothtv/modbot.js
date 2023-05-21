const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Testing the bot'),
    async execute(interaction, client) {
        await interaction.reply({ content: 'I am alive' });
    }
}