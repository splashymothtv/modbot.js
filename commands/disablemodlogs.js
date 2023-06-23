const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { QuickDB } = require('quick.db');

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('disable-mlogchannel')
    .setDescription('disable the mod logs channel'),
    async execute(interaction) {
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'Only admins can disable a mod logs channel', ephemeral: true });

        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setColor('Aqua')
        .setDescription(`✅ : your mod logs channel has been deleted`)

        await db.delete(`mlogchannel_${interaction.guild.id}`, channel.id)

        await interaction.reply({ embeds: [embed] });
    }
}
