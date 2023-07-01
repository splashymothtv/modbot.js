const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-wel-system')
    .setDescription('Remove the welcome channel'),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'Only admins can remove a welcome channel', ephemeral: true });

        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setDescription(`✅ : your welcome channel has been removed`)

        await db.delete(`welchannel_${interaction.guild.id}`, channel.id)

        await interaction.reply({ embeds: [embed] });
    }
}