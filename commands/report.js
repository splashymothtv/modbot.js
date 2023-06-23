const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const reportSchema = require('../Schemas.js/reportSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report command'),

    async execute(interaction, client) {
        
        reportSchema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
            if (!data) {
                return await interaction.reply({ content: 'No report system has been set up yet!', ephemeral: true })
            }

            if (data) {
                const modal = new ModalBuilder()
                .setTitle('Report form')
                .setCustomId('modal')

                const contact = new TextInputBuilder()
                .setCustomId('contact')
                .setRequired(true)
                .setLabel('Provide us with a form of contact')
                .setPlaceholder('Discord is usually the best form of contact')
                .setStyle(TextInputStyle.Short)

                const issue = new TextInputBuilder()
                .setCustomId('issue')
                .setRequired(true)
                .setLabel('What are you reporting to us?')
                .setPlaceholder('A member, server issue, something else')
                .setStyle(TextInputStyle.Short)

                const description = new TextInputBuilder()
                .setCustomId('description')
                .setRequired(true)
                .setLabel('Describe your issue.')
                .setPlaceholder('In as much detail as possible')
                .setStyle(TextInputStyle.Paragraph)

                const firstActionRow = new ActionRowBuilder().addComponents(contact)
                const secondActionRow = new ActionRowBuilder().addComponents(issue)
                const thirdActionRow = new ActionRowBuilder().addComponents(description)

                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

                interaction.showModal(modal)
            }
        })
    }
}