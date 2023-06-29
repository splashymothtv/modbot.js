const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const joinleaveSchema = require("../Schemas.js/joinleaveSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join-leave")
    .setDescription("Set the channels where join/leave messages are sent")
    .addSubcommand((command) =>
      command.setName("set-join")
      .setDescription("Set up the welcome channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "this is the channel where the welcome messages are sent"
        )
        .setRequired(true)
    )
    .addSubcommand((command) =>
      command.setName("set-leave")
      .setDescription("Set up the welcome channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "this is the channel where the goodbye messages are sent"
        )
        .setRequired(true)
    )

    .addSubcommand((command) =>
      command
        .setName("disable-join")
        .setDescription("Disable the welcome channel")
    )
    .addSubcommand((command) =>
      command
        .setName("disable-leave")
        .setDescription("Disable the goodbye channel")
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    )
      return await interaction.reply({
        content: "You don't have permission to use this command!",
        ephemeral: true,
      });

    const Data = await joinleaveSchema.findOne({ Guild: interaction.guild.id });

    const { options } = interaction;
    const sub = options.getSubcommand();

    switch (sub) {
      case "set-join":
        if (Data)
          return await interaction.reply({
            content: `This guild already has a designated welcome channel!`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await joinleaveSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(
              `✅ : your welcome channel has been set to ${channel}`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-join":
        if (!Data)
          return interaction.reply({
            content: `This guild does not have a designated welcome channel!`,
            ephemeral: true,
          });
        else {
          await joinleaveSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your welcome channel has been disabled! Use the /welchannel-setup to assign another channel!`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "set-leave":
        if (Data)
          return await interaction.reply({
            content: `This guild already has a designated goodbye channel!`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await joinleaveSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setDescription(
              `✅ : your goodbye channel has been set to ${channel}`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-leave":
        if (!Data)
          return interaction.reply({
            content: `This guild does not have a designated goodbye channel!`,
            ephemeral: true,
          });
        else {
          await joinleaveSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your goodbye channel has been disabled! Use the /welchannel-setup to assign another channel!`
            );

          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};
