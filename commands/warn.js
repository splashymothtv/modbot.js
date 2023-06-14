<<<<<<< HEAD
const { SlashCommandBuilder, } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option => option.setName('target').setDescription('The user you are trying to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for warning').setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return await interaction.reply({ content: "You do not have permission to use this command!" });

        const member = interaction.options.getUser('target');
        let reason = interaction.options.getString('reason');

        if (!reason) reason = "No reason provided.";

        const dmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:white_check_mark: A warning has been issued to you in ${interaction.guild.name} | ${reason} `)

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:white_check_mark: ${member.tag} has been **warned** | ${reason}`)

        await interaction.reply({ embeds: [embed] });
        await member.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        db.add(`warns_${member}`, 1);
    }
=======
const { SlashCommandBuilder, } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option => option.setName('target').setDescription('The user you are trying to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for warning').setRequired(false)),
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
            return await interaction.reply({ content: "You do not have permission to use this command!" });

        const member = interaction.options.getUser('target');
        let reason = interaction.options.getString('reason');

        if (!reason) reason = "No reason provided.";

        const dmEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:white_check_mark: A warning has been issued to you in ${interaction.guild.name} | ${reason} `)

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`:white_check_mark: ${member.tag} has been **warned** | ${reason}`)

        await interaction.reply({ embeds: [embed] });
        await member.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        db.add(`warns_${member}`, 1);
    }
>>>>>>> b0bbb84487ce229c1ccec1dd6e3e3c352c4b62c1
}