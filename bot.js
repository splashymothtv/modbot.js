const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  GatewayIntentBits,
  Partials,
  TextInputBuilder,
  AttachmentBuilder,
  ModalBuilder,
  MessageManager,
  PermissionsBitField,
  Permissions,
  Buttons,
  Embeds,
  EmbedBuilder,
  Events,
  Collection,
  ChannelType,
  AuditLogEvent,
  DMChannel,
  GuildMember,
  GuildHubType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionCollector,
  TextInputStyle,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel, Partials.Reaction, Partials.Message],
});
const mongoose = require("mongoose");
const today = new Date().toLocaleDateString();
const config = require("./config.json");
const { CaptchaGenerator } = require("captcha-canvas");
const { QuickDB } = require("quick.db");

const {
  token,
  clientId,
  guildId,
  mongoLogin,
  Insults,
  Racial_Slurs,
  Sexual,
  Sexism,
  Anti_LGBTQ,
} = require("./config.json");

const keepAlive = require("./server.js");

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, "commands");
  const files = fs.readdirSync(path.resolve(__dirname, "commands"));
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}
mongoose.connect(mongoLogin || "", {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, () => {
  console.log(`${client.user.tag} is alive!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  console.log(interaction);

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const db = new QuickDB();

client.on(Events.GuildMemberAdd, async (member) => {
  const { user, guild } = member;

  const channelID = await db.get(`welchannel_${member.guild.id}`);
  const channel = member.guild.channels.cache.get(channelID);

  const welcomedmEmbed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`**Welcome to ${guild.name}**, ${member.user.tag}!`)
    .setDescription(`Please complete the captcha below!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp(Date.now());

  const welcomeEmbed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`${member.user.tag} has joined the server!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp(Date.now());

  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("button")
      .setEmoji("✅")
      .setLabel("Verify")
      .setStyle(ButtonStyle.Success)
  );

  const verifyEmbed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle("Server verification")
    .setDescription("Get verified in the server");

  member.send({ embeds: [welcomedmEmbed] });
  channel.send({ embeds: [welcomeEmbed] });
});

client.on(Events.GuildMemberRemove, async (member) => {
  const { user, guild } = member;

  const channelID = await db.get(`byechannel_${member.guild.id}`);
  const channel = member.guild.channels.cache.get(channelID);

  const goodbyeEmbed = new EmbedBuilder()
    .setColor("Purple")
    .setTitle(`**${member.user.tag}** has left ${guild}!`)
    .setDescription(`Let's hope they enjoyed their time with us!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp(Date.now());

  channel.send({ embeds: [goodbyeEmbed] });
});

//mod logging

client.on(Events.ChannelCreate, async (channel) => {
  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 5) type = "Announcement";
      if (type == 4) type = "Category";

      const channelID = await db.get(`serlogchannel_${message.guild.id}`);
      const mChannel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Channel created")
        .addFields({
          name: "Channel Name",
          value: `${name} (<@${id}>)`,
          inline: false,
        })
        .addFields({ name: "Channel Type", value: `${type}`, inline: false })
        .addFields({ name: "Channel ID", value: `${id}`, inline: false })
        .addFields({
          name: "Created By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.ChannelDelete, async (channel) => {
  channel.guild
    .fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = "Text";
      if (type == 2) type = "Voice";
      if (type == 13) type = "Stage";
      if (type == 15) type = "Form";
      if (type == 5) type = "Announcement";
      if (type == 4) type = "Category";

      const channelID = await db.get(`serlogchannel_${message.guild.id}`);
      const mChannel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Channel created")
        .addFields({ name: "Channel Name", value: `${name}`, inline: false })
        .addFields({ name: "Channel Type", value: `${type}`, inline: false })
        .addFields({ name: "Channel ID", value: `${id}`, inline: false })
        .addFields({
          name: "Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanAdd, async (member) => {
  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanAdd,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = member.user.username;
      const id = member.user.id;

      const channelID = await db.get(`mlogchannel_${member.guild.id}`);
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Member Ban")
        .addFields({
          name: "Member Name",
          value: `${name} (<@${id}>)`,
          inline: false,
        })
        .addFields({ name: "Member ID", value: `${id}`, inline: false })
        .addFields({
          name: "Banned By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.GuildBanRemove, async (member) => {
  member.guild
    .fetchAuditLogs({
      type: AuditLogEvent.GuildBanRemove,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const name = member.user.username;
      const id = member.user.id;

      const channelID = await db.get(`mlogchannel_${member.guild.id}`);
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Member Unbanned")
        .addFields({
          name: "Member Name",
          value: `${name} (<@${id}>)`,
          inline: false,
        })
        .addFields({ name: "Member ID", value: `${id}`, inline: false })
        .addFields({
          name: "Unbanned By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageCreate, async (message) => {
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageCreate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mes = message.content;

      if (!mes) return;

      const channelID = await db.get(`msglogchannel_${message.guild.id}`);
      const mChannel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Message Created")
        .addFields({ name: "Message Content", value: `${mes}`, inline: false })
        .addFields({
          name: "Message Channel",
          value: `${message.channel}`,
          inline: false,
        })
        .addFields({
          name: "Created By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageDelete, async (message) => {
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mes = message.content;

      if (!mes) return;

      const channelID = await db.get(`msglogchannel_${message.guild.id}`);
      const mChannel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Message Deleted")
        .addFields({ name: "Message Content", value: `${mes}`, inline: false })
        .addFields({
          name: "Message Channel",
          value: `${message.channel}`,
          inline: false,
        })
        .addFields({
          name: "Deleted By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

client.on(Events.MessageUpdate, async (message, newMessage) => {
  message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageUpdate,
    })
    .then(async (audit) => {
      const { executor } = audit.entries.first();

      const mes = message.content;

      if (!mes) return;

      const channelID = await db.get(`msglogchannel_${message.guild.id}`);
      const mChannel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Message Edited")
        .addFields({ name: "Message Content", value: `${mes}`, inline: false })
        .addFields({
          name: "Message Channel",
          value: `${newMessage}`,
          inline: false,
        })
        .addFields({
          name: "Edited By",
          value: `${executor.tag}`,
          inline: false,
        })
        .setTimestamp()
        .setFooter({ text: "Mod logging system" });

      mChannel.send({ embeds: [embed] });
    });
});

//reports

const reportSchema = require("./Schemas.js/reportSchema");
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === "modal") {
    const contact = interaction.fields.getTextInputValue("contact");
    const issue = interaction.fields.getTextInputValue("issue");
    const description = interaction.fields.getTextInputValue("description");

    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTimestamp()
      .addFields({
        name: "Form of contact",
        value: ` ${contact}`,
        inline: false,
      })
      .addFields({ name: "Issue reported", value: ` ${issue}`, inline: false })
      .addFields({
        name: "description of issue",
        value: ` ${description}`,
        inline: false,
      });

    reportSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
      if (!data) return;

      if (data) {
        const channelID = data.Channel;

        const channel = interaction.guild.channels.cache.get(channelID);

        channel.send({ embeds: [embed] });

        await interaction.reply({
          content: "Your report has been sent to the moderators",
          ephemeral: true,
        });
      }
    });
  }
});

client.on(Events.MessageCreate, async (message, interaction) => {
  const author = message;

  if (message.author.bot) return;

  if (
    config.Insults.some((word) => message.content.toLowerCase().includes(word))
  ) {
    message.delete();
    console.log(
      `${today} A message from ${message.author.id} in ${message.guild.name} has been removed due to usage of insults`
    );

    await message.channel.send(
      `${message.author.id} Insults are not allowed in this server!`
    );
  }
});

client.on(Events.MessageCreate, async (message, interaction) => {
  const author = message;

  if (message.author.bot) return;

  if (
    config.Racial_Slurs.some((word) =>
      message.content.toLowerCase().includes(word)
    )
  ) {
    message.delete();
    console.log(
      `${today} A message from ${message.author.id} in ${message.guild.name} has been removed due to usage of racial slurs`
    );

    await message.channel.send(
      `${message.author.id} Racial slurs are not allowed in this server!`
    );
  }
});
client.on(Events.MessageCreate, async (message, interaction) => {
  const author = message;

  if (message.author.bot) return;

  if (
    config.Sexism.some((word) => message.content.toLowerCase().includes(word))
  ) {
    message.delete();
    console.log(
      `${today} A message from ${message.author.id} in ${message.guild.name} has been removed due to sexism`
    );

    await message.channel.send(
      `${message.author.id} Sexism is not allowed in this server!`
    );
  }
});
client.on(Events.MessageCreate, async (message, interaction) => {
  const author = message;

  if (message.author.bot) return;

  if (
    config.Sexual.some((word) => message.content.toLowerCase().includes(word))
  ) {
    message.delete();
    console.log(
      `${today} A sexually explicit message from ${message.author.id} in ${message.guild.name} has been removed`
    );

    await message.channel.send(
      `${message.author.id} Insults are not allowed in this server!`
    );
  }
});
client.on(Events.MessageCreate, async (message, interaction) => {
  const author = message;

  if (message.author.bot) return;

  if (
    config.Anti_LGBTQ.some((word) =>
      message.content.toLowerCase().includes(word)
    )
  ) {
    message.delete();
    console.log(
      `${today} A message from ${message.author.id} in ${message.guild.name} has been removed due to usage of Anti-LGBTQ+ slurs`
    );

    await message.channel.send(
      `${message.author.id} Anti_LGBTQ+ slurs are not allowed in this server!`
    );
  }
});

//button

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.customId !== "expirebutton") return;

  await interaction.reply({ content: `Button working`, ephemeral: true });
});

//interaction logging

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction) return;
  if (!interaction.isChatInputCommand()) return;
  else {
    const channelID = "1119873329919180820";
    const channel = await client.channels.cache.get(channelID);
    const server = interaction.guild.name;
    const user = interaction.user.tag;
    const userId = interaction.user.id;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`⚠️ Chat Command Used!`)
      .addFields({ name: `Server Name`, value: `${server}` })
      .addFields({ name: `Chat Command`, value: `${interaction}` })
      .addFields({ name: `User`, value: `${user} / ${userId}` })
      .setTimestamp()
      .setFooter({ text: `Chat Command Executed` });

    await channel.send({ embeds: [embed] });
  }
});

//captcha verification

const capSchema = require("./Schemas.js/capSchema");

let guild;

client.on(Events.GuildMemberAdd, async (member) => {
  const Data = await capSchema.findOne({ Guild: member.guild.id });
  if (!Data) return;
  else {
    const cap = Data.Captcha;

    const captcha = new CaptchaGenerator()
      .setDimension(150, 450)
      .setCaptcha({ text: `${cap}`, size: 60, color: "green" })
      .setDecoy({ opacity: 0.5 })
      .setTrace({ color: "green" });

    const buffer = captcha.generateSync();

    const attachment = new AttachmentBuilder(buffer, { name: "captcha.png" });

    const embed = new EmbedBuilder()
      .setColor("Grey")
      .setImage("attachment://captcha.png")
      .setTitle(`Solve the captcha to be verified in ${member.guild.name}!!`)
      .setFooter({
        text: `Use the button below to submit your captcha answer!!`,
      });

    const capButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("capButton")
        .setLabel("Submit")
        .setStyle(ButtonStyle.Danger)
    );

    const capModal = new ModalBuilder()
      .setTitle("Submit Captcha Answer")
      .setCustomId("capModal");

    const answer = new TextInputBuilder()
      .setCustomId("answer")
      .setRequired(true)
      .setLabel("Your captcha answer")
      .setPlaceholder(
        "Submit what you think the captcha is. You can always try again!!"
      )
      .setStyle(TextInputStyle.Short);

    const firstActionRow = new ActionRowBuilder().addComponents(answer);

    capModal.addComponents(firstActionRow);

    const msg = await member
      .send({ embeds: [embed], files: [attachment], components: [capButton] })
      .catch((err) => {
        return;
      });

    const collector = msg.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId === "capButton") {
        i.showModal(capModal);
      }
    });

    guild = member.guild;
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  else {
    if (!interaction.customId === "capModal") return;
    const Data = await capSchema.findOne({ Guild: guild.id });

    const answer = interaction.fields.getTextInputValue("answer");
    const cap = Data.Captcha;

    if (answer != `${cap}`)
      return await interaction.reply({
        content: "That was wrong.... Try again!",
        ephemeral: true,
      });
    else {
      const roleID = Data.Role;

      const capGuild = await client.guilds.fetch(guild.id);
      const role = await capGuild.roles.cache.get(roleID);
      const member = await capGuild.members.fetch(interaction.user.id);

      await member.roles.add(role).catch((err) => {
        interaction.reply({
          content:
            "There was an error in the verifying process, contact server staff to proceed, please.",
          ephemeral: true,
        });
      });

      await interaction.reply({
        content: `🎈🎉YAY!! You have been verified for the server ${capGuild.name}🎉🎈`,
      });
    }
  }
});

client.login(token);
keepAlive();
