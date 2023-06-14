const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const reportSchema = require('../schemas/reportSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report-disable')
    .setDescription('disables a report system'),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'You must have admin permissions to disable a report system.' });
        
        const { channel, guildId, options } = interaction;
        const repChannel = options.getChannel('channel');

        const embed = new EmbedBuilder()
        
        reportSchema.deleteMany({ Guild: guildId }, async(err, data) => {
            embed.setColor('Red')
            .setDescription(`✅ : Your Report system has been deleted`)

            return await interaction.reply({ embeds: [embed] });
        })
    }
}