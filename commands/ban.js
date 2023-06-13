const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans target member from the server')
        .addUserOption((option) =>
            option.setName("target")
                .setDescription("The target you want to ban.")
                .setRequired(true)
        )
        .addStringOption(option => option.setName("reason")
            .setDescription("The reason for banning the user.")
        ),
    async execute(interaction, client) {
        const users = await interaction.options.getUser('target');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) 
        return await interaction.reply({ content: `You do not have the permission required to use this command!`, ephemeral: true});
        if (interaction.member.id === ID) 
        return await interaction.reply({ content: `You can't ban yourself!`, ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason was given.";

        const dmEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`‼ : You have been banned from **${interaction.guild.name}** | ${reason}`)

        const Embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`✅ : ${banUser.tag} has been **banned** | ${reason}`)

        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: `I am having trouble banning ${banUser.tag}`, ephemeral: true});
        })

        await banUser.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })
        
        await interaction.reply({ embeds: [embed] });

    },
};
