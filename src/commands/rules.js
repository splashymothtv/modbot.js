const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rules")
    .setDescription("Returns the rules embed"),
  async execute(interaction, client) {
    const channelID = await db.get(`rulchannel_${interaction.guild.id}`);
    const rulesChannel = interaction.guild.channels.cache.get(channelID);

    const rulesEmbed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("Server Etiquette")
      .addFields({ name: "Rule #1", value: "Be respectful!" })
      .addFields({
        name: "Rule #2",
        value:
          "Messages containing racial slurs, sexism, mention of genitalia or Anti-LGBTQ+ rhetoric will be removed by ModBot!",
      })
      .addFields({
        name: "Rule #3",
        value:
          "Swearing is allowed as long as it is not directed at another member.",
      })
      .addFields({
        name: "Rule #4a",
        value: "Members must reach Level 5 to be added to notif autoposters",
      })
      .addFields({
        name: "Rule #4b",
        value:
          "Follow4Follow/Sub4Sub/View4View etc, are against Twitch ToS, therefore are not allowed in this server!",
      })
      .addFields({
        name: "Rule #5a",
        value: "Promoting of MLM/pyramid schemes is strictly **FORBIDDEN**",
      })
      .addFields({ name: "Rule #5b", value: "Scam links will be removed." })
      .addFields({
        name: "Rule #6",
        value:
          "Promoting of NSFW content, ie OnlyFans, is strictly **FORBIDDEN**",
      })
      .addFields({
        name: "Rule #7",
        value:
          "Do not beg for freebies or giveaways! The only free items you will get are in the #resources channel",
      })
      .addFields({ name: "Rule #8", value: "Do not ask to be a moderator!" })
      .addFields({ name: "Rule #9", value: "Do not beg for views/subs etc." })
      .addFields({
        name: "Rule #10",
        value: "Do not beg for a higher Level or points",
      })
      .setFooter({
        text: "**Failure to comply with these rules will result in members being timed out/kicked and/or banned from the server!**",
      })
      .setTimestamp();

    rulesChannel.send({ embeds: [rulesEmbed] });
  },
};
