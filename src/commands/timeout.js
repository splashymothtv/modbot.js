const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField } = require('discord.js');
const timeoutSchema = require("../Schemas.js/timeoutSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout commands")
    .addSubcommand((command) =>
      command
        .setName("add")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The target you want to timeout.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("time")
            .setDescription("Duration of the timeout.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for timing out the user.")
        )
    )
    .addSubcommand((command) =>
      command.setName("remove")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The target you want to untimeout.")
          .setRequired(true)
      )
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ModerateMembers
      )
    )
      return await interaction.reply({
        content: `Only moderators can use this command`,
        ephemeral: true,
      });

    const { options, guild } = interaction;

    const sub = options.getSubcommand();
    const data = await timeoutSchema.find({
      Guild: interaction.guild.id,
      User: user.tag,
      Reason: reason,
    });

    switch (sub) {
      case "add":
        const user = await interaction.options.getUser("target");
        let reason = interaction.options.getString("reason");
        const time = interaction.options.getInteger("time");
        const member = await interaction.guild.members.fetch(user.id);
        const modChannel = guild.channels.cache
          .get(modChannel)
          .catch(console.error);

        if (!reason) reason = "No reason was given.";
        if (!time) time = null;

        let checkdata = await timeoutSchema.findOne({
          Guild: interaction.guild.id,
          User: user.tag,
          Reason: reason,
        });
        if (checkdata) {
          await interaction.deferReply({ ephemeral: true });
        }
        await timeoutSchema.create({
          Guild: interaction.guild.id,
          Channel: modChannel.id,
          User: user.tag,
          Reason: reason || " ",
          Time: time || " ",
          Member: user.id,
        });

        await user
          .send({
            content: `You have been timed from: ${interaction.guild.name}\nReason: ${reason}`,
          })
          .catch(console.log(`user\'s DM\'s are off`));

        await member
          .timeout(time == null ? null : time * 60 * 1000, reason)
          .catch(console.error);

        await interaction.reply({
          content: `${user.tag} has been timed out!`,
        });

        break;
      case "remove":
        if (!data)
          return await interaction.reply({
            content: `This user has no timeouts against them`,
            ephemeral: true,
          });
        else {
          const user = await interaction.options.getUser("target");
          let checkdata = await timeoutSchema.findOne({
            Guild: interaction.guild.id,
            User: user.tag,
            Reason: reason,
          });
          if (!checkdata)
            return await interaction.reply({
              content: `${user.tag} is currently not timed out`,
            });
          await user
            .send({
              content: `Your timeout in: ${interaction.guild.name} has been removed.\nReason: ${reason}`,
            })
            .catch(console.log(`user\'s DM\'s are off`));

          await interaction.reply({
            content: `The timeout for ${user.tag} has been removed!`,
          });
        }
    }
  },
};
