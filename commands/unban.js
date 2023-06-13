const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans target member from the server')
        .addUserOption((option) =>
            option.setName("target")
                .setDescription("The target you want to unban.")
                .setRequired(true)
        )
        .addStringOption(option => option.setName("reason")
            .setDescription("The reason for unbanning the user.")
        ),
    async execute(interaction, client) {
        const userID = await interaction.options.getUser('target');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.UnbanMembers)) 
        return await interaction.reply({ content: `You do not have the permission required to use this command!`, ephemeral: true});
        if (interaction.member.id === userID) 
        return await interaction.reply({ content: `You can't unban yourself!`, ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason was given.";

        const Embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`✅ : <@${userID}> has been **unbanned** | ${reason}`)

        await interaction.guild.bans.fetch()
        .then(async bans => {
            if (bans.size === 0) return await interaction.reply({ content: 'No one has been banned in this server!', ephemeral: true });
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID) return await interaction.reply({ content: `${userID} has not been banned in this server!`, ephemeral: true });

            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: `I am having trouble unbanning ${userID}`, ephemeral: true });
            })
        })
        await interaction.reply({ embeds: [embed] });

    },
};

