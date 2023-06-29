const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const logSchema = require("../Schemas.js/logSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("logs")
    .setDescription("Set up logging channels")
    .addSubcommand((command) =>
      command
        .setName("set-modlogs")
        .setDescription("Set up the mod logs channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "this is the channel where the mod logs messages are sent"
        )
        .setRequired(true)
    )
    .addSubcommand((command) =>
      command
        .setName("disable-modlogs")
        .setDescription("Disable the mod logs channel")
    )
    .addSubcommand((command) =>
      command
        .setName("set-memberlogs")
        .setDescription("Set up the member logs channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "this is the channel where the mod logs messages are sent"
        )
        .setRequired(true)
    )
    .addSubcommand((command) =>
      command
        .setName("disable-memberlogs")
        .setDescription("Disable the member logs channel")
    )
    .addSubcommand((command) =>
      command
        .setName("set-meslogs")
        .setDescription("Set up the message logs channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("this is the channel where the message logs are sent")
        .setRequired(true)
    )
    .addSubcommand((command) =>
      command
        .setName("disable-meslogs")
        .setDescription("Disable the message logs channel")
    )
    .addSubcommand((command) =>
      command
        .setName("set-comlogs")
        .setDescription("Set up the command logs channel")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("this is the channel where the command logs are sent")
        .setRequired(true)
    )
    .addSubcommand((command) =>
      command
        .setName("disable-comlogs")
        .setDescription("Disable the command logs channel")
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

    const Data = await logSchema.findOne({ Guild: interaction.guild.id });

    const { options } = interaction;
    const sub = options.getSubcommand();

    switch (sub) {
      case "set-modlogs":
        if (Data)
          return await interaction.reply({
            content: `This server already has a designated mod logging system`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅: Your mod logging channel has been set to ${channel}`
            );
          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-modlogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated mod logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❗: Your mod logging channel has been disabled!`);

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "set-memberlogs":
        if (Data)
          return await interaction.reply({
            content: `This server already has a designated member logging channel`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅: Your member logging channel has been set to ${channel}`
            );
          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-memberlogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated member logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your member logging channel has been disabled!`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-modlogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated mod logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`❗: Your mod logging channel has been disabled!`);

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "set-memberlogs":
        if (Data)
          return await interaction.reply({
            content: `This server already has a designated member logging channel`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅: Your member logging channel has been set to ${channel}`
            );
          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-memberlogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated member logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your member logging channel has been disabled!`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "set-meslogs":
        if (Data)
          return await interaction.reply({
            content: `This server already has a designated message logging channel`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅: Your message logging channel has been set to ${channel}`
            );
          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-meslogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated message logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your message logging channel has been disabled!`
            );

          await interaction.reply({ embeds: [embed] });
        }
        break;
      case "set-comlogs":
        if (Data)
          return await interaction.reply({
            content: `This server already has a designated command logging channel`,
            ephemeral: true,
          });
        else {
          const channel = interaction.options.getChannel("channel");

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `✅: Your command logging channel has been set to ${channel}`
            );
          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable-comlogs":
        if (!Data)
          return interaction.reply({
            content: `This server does not have a designated command logging channel!`,
            ephemeral: true,
          });
        else {
          await logSchema.deleteMany({ Guild: interaction.guild.id });

          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `❗: Your command logging channel has been disabled!`
            );

          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};
