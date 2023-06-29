const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('this is the help command'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Help Center")
        .setDescription("Help Command Guide")
        .addFields({ name: 'Page 1', value: 'Help and resources (button1)'})
        .addFields({ name: 'Page 2', value: 'Community commands (button2)'})
        .addFields({ name: 'Page 3', value: 'Moderation commands (button3)'})

        const embed2 = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Community commands")
        .addFields({ name: '/help', value: 'Retrieves this embed'})
        .addFields({ name: '/wiki', value: 'Search wikipedia'})
        .addFields({ name: '/alive', value: 'Responds with (I am alive)'})
        .setFooter({ text: 'community commands'})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Moderation commands")
        .addFields({ name: '/invites', value: 'Checks a users invites'})
        .addFields({ name: '/reactrole', value: 'Creates a reaction role message'})
        .addFields({ name: '/ticket', value: 'Create a ticket'})
        .addFields({ name: '/status', value: 'Customises bot status'})
        .addFields({ name: '/timeout', value: 'Timeout a user'})
        .addFields({ name: '/kick', value: 'Kick a user from the server'})
        .addFields({ name: '/warn', value: 'Warn a user if they break the rules'})
        .addFields({ name: '/verify', value: 'Creates a verification message'})
        .addFields({ name: '/warnings', value: 'Checks users warnings'})
        .addFields({ name: '/clearwarns', value: 'Clears warnings of a target user'})
        .addFields({ name: '/user', value: 'Gets user information'})
        .addFields({ name: '/steal', value: 'Steals emojis'})
        .addFields({ name: '/badges', value: 'Checks user badges'})
        .addFields({ name: '/yt', value: 'Add a YouTube channel notification'})
        .setFooter({ text: 'Moderation commands'})
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setLabel('Page 1')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setLabel('Page 2')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page3')
            .setLabel('Page 3')
            .setStyle(ButtonStyle.Success),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'page1') {
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
                }
                await i.update({ embeds: [embed], components: [button] });
            }

            if (i.customId === 'page2') {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
                }
                await i.update({ embeds: [embed2], components: [button] })
            }

            if (i.customId === 'page3') {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `Only ${interaction.user.tag} can use these buttons`, ephemeral: true })
                }
                await i.update({ embeds: [embed3], components: [button] })
            }
        })

    },
};