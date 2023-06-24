const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-msglogchannel")
    .setDescription("Disable the msg logs channel"),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Only admins can disable a msg logs channel",
        ephemeral: true,
      });

    const channel = interaction.options.getChannel("channel");

    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .setDescription(`✅ : your msg logs channel has been removed`);

    await db.delete(`msglogchannel_${interaction.guild.id}`, channel.id);

    await interaction.reply({ embeds: [embed] });
  },
};
