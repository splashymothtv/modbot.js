const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const reportSchema = require('../Schemas.js/reportSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report-setup')
    .setDescription('Set up a report system')
    .addChannelOption(option => option.setName('channel')
    .setDescription('The report channel')
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'You must have admin permissions to setup a report system.' });
        
        const { channel, guildId, options } = interaction;
        const repChannel = options.getChannel('channel');

        const embed = new EmbedBuilder()
        
        reportSchema.findOne({ Guild: guildId }, async(err, data) => {

            if (!data) {
                await reportSchema.create({
                    Guild: guildId,
                    Channel: repChannel.id
                })

                embed.setColor('Red')
                .setDescription(`✅ : All reports made will be sent to ${repChannel}`)
            } else if (data) {
                const c = client.channels.cache.get(data.channel);
                embed.setColor('Red')
                .setDescription(`✅ : Your report channel has already been set to ${c}`)
            }

            return await interaction.reply({ embeds: [embed] });

        })
    }
}