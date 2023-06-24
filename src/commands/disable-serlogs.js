const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disable-serlogchannel")
    .setDescription("Disable the server logs channel"),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "Only admins can disable a server logs channel",
        ephemeral: true,
      });

    const channel = interaction.options.getChannel("channel");

    const embed = new EmbedBuilder()
      .setColor("Aqua")
      .setDescription(`✅ : your server logs channel has been removed`);

    await db.delete(`serlogchannel_${interaction.guild.id}`, channel.id);

    await interaction.reply({ embeds: [embed] });
  },
};
