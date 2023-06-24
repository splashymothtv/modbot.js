const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setverchannel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "this is the channel where the verify messages are sent"
        )
        .setRequired(true)
    )
    .setDescription("Set the verification channel"),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Only admins can set a verify channel",
        ephemeral: true,
      });

    const channel = interaction.options.getChannel("channel");

    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .setDescription(
        `✅ : your verification channel has been set to ${channel}`
      );

    await db.set(`verchannel_${interaction.guild.id}`, channel.id);

    await interaction.reply({ embeds: [embed] });
  },
};
