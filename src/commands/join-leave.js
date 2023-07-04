const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const welSchema = require("../../Schemas.js/welSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welchannel")
    .setDescription("Configure the welcome channel for your server")
    .addSubcommand((command) =>
      command
        .setName("set")
        .setDescription("The channel for your welcome messages")
        .addChannelOption((option) =>
          option.setName("channel").setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("disbale").setDescription("Disable the welcome channel")
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return await interaction.reply({
        content: `You are not allowed to use this command`,
        ephemeral: true,
      });

    const data = await welSchema.findOne({
      Guild: interaction.guild.id,
    });
    const sub = options.getSubcommand();
    const { options, channel, guild } = interaction;

    switch (sub) {
      case "set":
        if (data)
          return await interaction.reply({
            content: `This guild already has a designated channel for welcome messages`,
            ephemeral: true,
          });
        else {
          const welChannel = options.getChannel("channel");

          const embed = new EmbedBuilder();
          welSchema.findOne({
            Guild: interaction.guild.id,
            Channel: welChannel.id,
          });

          embed
            .setColor("Green")
            .setDescription(
              `Your welcome channel has been set to ${welChannel}`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;
      case "disable":
        if (!data)
          return await interaction.reply({
            content: `This guild does not have an assigned welcome channel`,
            ephemeral: true,
          });
        else {
          const embed = new EmbedBuilder();
          await welSchema.deleteMany({
            Guild: interaction.guild.id,
            Channel: welChannel.id,
          });
          embed
            .setColor("Red")
            .setDescription(`Your welcome channel has been disabled`);

          await interaction.reply({ embeds: [embed] });
        }
    }
  },
};

