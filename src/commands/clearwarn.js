const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarn")
    .setDescription("Clear a members warnings.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Whose warnings you want to clear")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("number")
        .setDescription("The number of warnings you want to clear")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    )
      return await interaction.reply({
        content: "You do not have permission to use this command!",
      });

    const member = interaction.options.getUser("target");
    const warnNum = interaction.options.getNumber("number");
    let warns = await db.get(`warns_${member}`);

    if (warns == null) warns = 0;

    if (warnNum > warns)
      return await interaction.reply({
        content: ` You can only clear ${warns} from ${member.tag}`,
        ephemeral: true,
      });

    let afWarns = await db.sub(`warns_${member}`, warnNum);

    if (!reason) reason = "No reason provided.";

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `:white_check_mark: ${member.tag} now has ${afwarns} warn(s)`
      );

    await interaction.reply({ embeds: [embed] });
  },
};
