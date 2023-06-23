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

        await interaction.reply({ content: 'Your report has been sent to the moderators', ephemeral: true });
      }
    })
  }
})

client.login(token);
keepAlive();
