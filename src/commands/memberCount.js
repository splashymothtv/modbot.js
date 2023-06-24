const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Provides a list of server members"),
  async execute(interaction) {
    const { guild } = interaction;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("DarkPurple")
          .setTitle("Member/Bot Count")
          .setDescription(
            `**Server Name:** ${guild.name}\n \n**Member Count:** ${guild.memberCount}`
          ),
      ],
    });
  },
};
