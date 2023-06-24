const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Make an expiring button"),
  async execute(interaction, client) {
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("expirebutton")
        .setLabel("button testing")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: `Button testing`,
      components: [button],
      ephemeral: true,
    });
  },
};
