const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ButtonStyle, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const ticketSchema = require('../schemas/ticketSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Submit a ticket message'),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
        return await interaction.reply({ content: 'You must have admin permissions to create a ticket message.' });

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setEmoji(`💌`)
            .setLabel('Create ticket')
            .setStyle(ButtonStyle.Primary),
            )

            const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle('Tickets & Support')
            .setDescription('Click here to talk to staff (create a ticket)')

            await interaction.reply({ embeds: [embed], components: [button] });

            const collector = await interaction.channel.createMessageComponentCollector();

            collector.on('collect', async i => {
                await i.update({ embeds: [embed], components: [button] });

                const channel = await interaction.guild.channels.create({
                    name: `ticket ${i.user.tag}`,
                    type: ChannelType.GuildText,
                    parent: `1118144680920625285`
                });

                channel.permissionOverwrites.create(i.user.id, { ViewChannel: true, SendMessages: true });
                channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false, SendMessages: false });
                channel.send({ content: `Welcome to your ticket, ${i.user}. Once you are finished here, please ask an admin to delete the channel.`});
                i.user.send(`Your ticket within ${i.guild.name} has been created. You may view it in ${channel}.`).catch(err => {
                    return;
                })
            })
        
    }
}