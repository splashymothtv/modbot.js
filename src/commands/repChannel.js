const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
    ChannelType,
  } = require("discord.js");
  const reportSchema = require("../Schemas.js/reportSchema");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("repchannel")
      .setDescription("Configure the report system")
      .addSubcommand((command) =>
        command.setName("setup").setDescription("Setup the report system")
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The report channel")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addSubcommand((command) =>
        command.setName("disable").setDescription("Disable the report system")
      ),
  
    async execute(interaction, client) {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      )
        return await interaction.reply({
          content: "You don't have perms to setup a report system.",
        });
  
      const Data = await reportSchema.findOne({ Guild: interaction.guild.id });
  
      const { options } = interaction;
      const repChannel = options.getChannel('channel')
      const sub = options.getSubcommand();
  
      switch (sub) {
        case "setup":
          if (Data)
            return await interaction.reply({
              content: `This server already has a report system set up`,
              ephemeral: true,
            });
          if (!Data) {
  
            await reportSchema.create({
              Guild: interaction.guild.id,
              Channel: repChannel.id,
            });
  
            const embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `✅: Your reports system has been set to ${repChannel}`
              );
  
            await interaction.reply({
              embeds: [embed],
            });
          }
  
          break;
        case "disable":
          if (!Data)
            return await interaction.reply({
              content: `This server does not have a designated report system yet!`,
              ephemeral: true,
            });
          else {
            await reportSchema.deleteMany({ Guild: interaction.guild.id });
  
            const embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription(`❗: Your report system has been disabled!`);
  
            await interaction.reply({
              embeds: [embed],
            });
          }
      }
    },
  };
  