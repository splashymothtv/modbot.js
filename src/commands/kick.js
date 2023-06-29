const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks target member from the server')
        .addUserOption((option) =>
            option.setName("target")
                .setDescription("The target you want to kick.")
                .setRequired(true)
        )
        .addStringOption(option => option.setName("reason")
        .setDescription("The reason for kicking the user.")
        ),
    async execute(interaction, client) {
        const user = await interaction.options.getUser('target');
        let reason = interaction.options.getString('reason');
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!reason) reason = "No reason was given.";

        await user.send({
            content: `You have been kicked from: ${interaction.guild.name}\nReason: ${reason}`
        }).catch(console.log(`user\'s DM\'s are off`));

        await member.kick(reason).catch(console.error);

        await interaction.reply({
            content: `${user.tag} has been kicked from the server!`
        });

    },
};