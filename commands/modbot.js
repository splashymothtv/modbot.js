const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modbot')
        .setDescription('Modbot commands'),
    async execute(interaction, client) {
        const embed =new EmbedBuilder()
        .setTitle("Modbot Commands!")
        .setDescription("This is an embedded message")
        .setColor(0x7289da)
        .setImage(client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag
        })
        .setTimestamp(Date.now())
        .setURL(`https://patreon.com/splashyreacts`)
        .addFields([
            {
                name: `/modbot`,
                value: `Returns this embed`,
                inline: false
            },
            {
                name: `/alive`,
                value: `Returns 'I am alive'`,
                inline: false
            },
            {
                name: `/ban`,
                value: `Bans a member`,
                inline: false
            },
            {
                name: `/kick`,
                value: `Kicks a member`,
                inline: false
            },
            {
                name: `/timeout`,
                value: `Timeout a member`,
                inline: false
            },
            {
                name: `/test`,
                value: `Checks if the bot is working`,
                inline: false
            },
            {
                name: `/hey`,
                value: `Responds with hey`,
                inline: false
            },
            {
                name: `/hug`,
                value: `Hug another user`,
                inline: false
            },
        ]);

        await interaction.reply({
            embeds: [embed]
        });

    },
};
