const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setwelchannel')
    .addChannelOption(option => option.setName('channel').setDescription('this is the channel where the welcome messages are sent').setRequired(true))
    .setDescription('Set the welcome channel'),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'Only admins can set a welcome channel', ephemeral: true });

        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setDescription(`✅ : your welcome channel has been set to ${channel}`)

        await db.set(`welchannel_${interaction.guild.id}`, channel.id)

        await interaction.reply({ embeds: [embed] });
    }
}