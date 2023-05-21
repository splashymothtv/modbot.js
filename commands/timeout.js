const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption((option) =>
            option.setName("target")
                .setDescription("The target you want to kick.")
                .setRequired(true)
        )
        .addIntegerOption((option) => option.setName("time")
            .setDescription("Duration of the timeout.")
        .setRequired(true)
        )
        .addStringOption(option => option.setName("reason")
            .setDescription("The reason for kicking the user.")
        ),
    async execute(interaction, client) {
        const user = await interaction.options.getUser('target');
        let reason = interaction.options.getString('reason');
        const time = interaction.options.getInteger("time");
        const member = await interaction.guild.members.fetch(user.id).catch(console.error);

        if (!reason) reason = "No reason was given.";
        if (!time) time = null;

        await user.send({
            content: `You have been timed from: ${interaction.guild.name}\nReason: ${reason}`
        }).catch(console.log(`user\'s DM\'s are off`));

        await member.timeout(time == null ? null: time * 60 * 1000, reason).catch(console.error);

        await interaction.reply({
            content: `${user.tag} has been timed out!`,
        });

    },
};