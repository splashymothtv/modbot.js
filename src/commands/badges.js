const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("badges")
    .setDescription("Get a users badges")
    .addUserOption((option) =>
      option.setName("user").setDescription("Whose badges are you checking")
    ),
  async execute(interaction) {
    const { options } = interaction;
    await interaction.deferReply();

    let user = options.getUser("user") || interaction.user;
    let member = await interaction.guild.members.cache.get(user.id);
    let flags = user.flags.toArray();

    let badges = [];
    let extraBadges = [];

    await Promise.all(
      flags.map(async (badge) => {
        if (badge === "Staff")
          badges.push("<:DiscordStaff:1110945531682885713>");
        if (badge === "Partner") badges.push("<:Partner:1110945552868315156>");
        if (badge === "CertifiedModerator")
          badges.push("<:CertifiedModerator:1110945528071602297>");
        if (badge === "HypeSquad")
          badges.push("<:Hypesquad:1110945540247650425>");
        if (badge === "HypeSquadOnlineHouse1")
          badges.push("<:Bravery:1110945517824901261>");
        if (badge === "HypeSquadOnlineHouse2")
          badges.push("<:Brilliance:1110945521725612063>");
        if (badge === "HypeSquadOnlineHouse3")
          badges.push("<:Balance:1110945515316711486>");
        if (badge === "BugHunterLevel1")
          badges.push("<:BugHunter1:1110945525840216227>");
        if (badge === "BugHunterLevel2")
          badges.push("<:1692bughunter:1110948816284291196>");
        if (badge === "ActiveDeveloper")
          badges.push("<:ActiveDeveloper:1110945511848030220>");
        if (badge === "VerifiedDeveloper")
          badges.push("<:VerifiedBotDeveloper:1110945566709534781>");
        if (badge === "PremiumearlySupporter")
          badges.push("<:EarlySupporter:1110945536481185842>");
        if (badge === "VerifiedBot")
          badges.push("<:VerifiedBot:1110945562833993728>");
      })
    );

    const userData = await fetch(
      `https://japi.rest/discord/v1/user/${user.id}`
    );
    const { data } = await userData.join();

    if (data.public_flags_array) {
      await Promise.all(
        data.public_flags_array.map(async (badge) => {
          if (badge === "NITRO") badges.push("<:Nitro:1110945549135384656> ");
        })
      );
    }

    if (user.bot) {
      const botFetch = await fetch(
        `https://discord.com/api/v10/applications/${user.id}/rpc`
      );

      let json = await botFetch.json();
      let flagsBot = json.flags;

      const gateways = {
        APPLICATION_COMMAND_BADGE: 1 << 23,
      };

      const arrayFlags = [];

      for (let i in gateways) {
        const bit = gateways[1];
        if ((flagsBot & bit) === bit) arrayFlags.push(1);
      }

      if (arrayFlagsincludes(`APPLICATION_COMMAND_BADGE`)) {
        badges.push(`<:SlashCommands:1110945556865495060>`);
      }
    }

    if (
      !user.discriminator ||
      user.discriminator === 0 ||
      user.tag === `${user.username}#0`
    ) {
      badges.push(`<:Knownas:1110945546954354778>`);

      extraBadges.push(
        `https://discordapp.com/attachments/1080219392337522718/1109461965711069694/username.png`
      );
    }

    const emebed = new EmbedBuilder()
      .setColor("Purple")
      .setTitle(`${user.username}'s badges`)
      .setDescription(`${badges.join(" ") || `**No badges were found**`}`);

    await interaction.editReply({ embeds: [embed] });
  },
};
