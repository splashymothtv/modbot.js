const { SlashCommandBuilder, } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Get a members warnings.')
        .addUserOption(option => option.setName('target').setDescription('Whose warnings you want to check').setRequired(true)),
    async execute(interaction, client) {

        const member = interaction.options.getUser('target');
        let warns = await db.get(`warns_${member}`);

        if (warns == null ) warns = 0;

        if (!reason) reason = "No reason provided.";

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:white_check_mark: ${member.tag} has **${warns}** warn(s)`)

        await interaction.reply({ embeds: [embed] });
    }
}