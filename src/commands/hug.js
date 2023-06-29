const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug Someone')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to hug')
                .setRequired(false))
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role you want to hug')
                .setRequired(false)),

    async execute(interaction) {
        const { options } = interaction;

        const user = interaction.options.getUser('user');

        const pingrole = options.getRole('role');

        let role = 'non';

        if (pingrole) {
            role = pingrole.id;
        }
        if (pingrole) {
            await interaction.reply(`${interaction.user} hugs ${interaction.options.getRole('role')}`);
        } else {
            await interaction.reply(`${interaction.user} hugs ${interaction.options.getUser('user')}`);

        }
    }
};