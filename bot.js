const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, MessageManager, PermissionsBitField, Permissions, Buttons, Embeds, EmbedBuilder, Events, Collection, ChannelType, AuditLogEvent, DMChannel, GuildMember, GuildHubType, ButtonBuilder, ButtonStyle, ActionRowBuilder, InteractionCollector } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel, Partials.Reaction, Partials.Message] });
const mongoose = require('mongoose');

const { token, clientId, guildId, mongoLogin } = require('./config.json');


const keepAlive = require("./server.js");

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, "commands");
  const files = fs.readdirSync(path.resolve(__dirname, 'commands'));
  const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.once(Events.ClientReady, () => {
      console.log(`${client.user.tag} is alive!`);
        client.pickPresence = async () => {
        const statusArray = [
            {
                type: ActivityType.Listening,
                content: '/commands',
                status: 'online'
            },
            {
                type: ActivityType.Watching,
                content: `over ${client.guilds.cache.size} servers!`,
                status: 'online'
            },
            {
                type: ActivityType.Streaming,
                content: `https://twitch.tv/splashymothtv`,
                status: 'online'
            }

        ];

        const option = Math.floor(Math.random() * statusArray.length);

        client.user.setPresence({
            activities: [
                {
                    name: statusArray[option].content,
                    type: statusArray[option].type,
                },
            ],

            status: statusArray[option].status,
        });

    };
});


client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  console.log(interaction);

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const { user, guild } = member;
  const welcomeChannel = member.guild.channels.cache.get('your-welcomeChannelId');
  const verificationChannel = member.guild.channels.cache.get('your-verificationChannelId');
  const rulesChannel = member.guild.channels.cache.get('your-rulesChannelId');
  const welcomeEmbed = new EmbedBuilder()
    .setColor('Purple')
    .setTitle(`**Welcome to ${guild.name}**, ${member.user.tag}!`)
    .setDescription(`Please **verify yourself** in <#verificationChannelId> , and read the **<#rulesChannelId>**`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp(Date.now())

  welcomeChannel.send({ embeds: [welcomeEmbed]  });
});
  client.on(Events.GuildMemberRemove, async (member) => {
  const { user, guild } = member;
  const goodbyeChannel = member.guild.channels.cache.get('your-welcomeChannelId');
  const goodbyeEmbed = new EmbedBuilder()
    .setColor('Purple')
    .setTitle(`**${member.user.tag}** has left ${guild.name}!`)
    .setDescription(`Let's hope they enjoyed their time with us!`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp(Date.now())

  goodbyeChannel.send({ embeds: [goodbyeEmbed]  });
});

//mod logging

client.on(Events.ChannelCreate, async channel => {
  channel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelCreate,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const name = channel.name;
    const id = channel.id;
    let type = channel.type;

    if (type == 0) type = 'Text'
    if (type == 2) type = 'Voice'
    if (type == 13) type = 'Stage'
    if (type == 15) type = 'Form'
    if (type == 5) type = 'Announcement'
    if (type == 4) type = 'Category'

    const channelID = 'your-log-channel-id';
    const mChannel = await channel.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Channel created')
    .addFields({ name: "Channel Name", value: `${name} (<@${id}>)`, inline: false})
    .addFields({ name: "Channel Type", value: `${type}`, inline: false})
    .addFields({ name: "Channel ID", value: `${id}`, inline: false})
    .addFields({ name: "Created By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
    

  })
})

client.on(Events.ChannelDelete, async channel => {
  channel.guild.fetchAuditLogs({
    type: AuditLogEvent.ChannelDelete,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const name = channel.name;
    const id = channel.id;
    let type = channel.type;

    if (type == 0) type = 'Text'
    if (type == 2) type = 'Voice'
    if (type == 13) type = 'Stage'
    if (type == 15) type = 'Form'
    if (type == 5) type = 'Announcement'
    if (type == 4) type = 'Category'

    const channelID = 'your-log-channel-id';
    const mChannel = await channel.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Channel created')
    .addFields({ name: "Channel Name", value: `${name}`, inline: false})
    .addFields({ name: "Channel Type", value: `${type}`, inline: false})
    .addFields({ name: "Channel ID", value: `${id}`, inline: false})
    .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
  })
})

client.on(Events.GuildBanAdd, async member => {
  member.guild.fetchAuditLogs({
    type: AuditLogEvent.GuildBanAdd,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const name = member.user.username;
    const id = member.user.id;

    const channelID = 'your-log-channel-id';
    const mChannel = await member.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Member Ban')
    .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
    .addFields({ name: "Member ID", value: `${id}`, inline: false})
    .addFields({ name: "Banned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
  })
})

client.on(Events.GuildBanRemove, async member => {
  member.guild.fetchAuditLogs({
    type: AuditLogEvent.GuildBanRemove,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const name = member.user.username;
    const id = member.user.id;

    const channelID = 'your-log-channel-id';
    const mChannel = await member.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Member Unbanned')
    .addFields({ name: "Member Name", value: `${name} (<@${id}>)`, inline: false})
    .addFields({ name: "Member ID", value: `${id}`, inline: false})
    .addFields({ name: "Unbanned By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
  })
})

client.on(Events.MessageDelete, async message => {
  message.guild.fetchAuditLogs({
    type: AuditLogEvent.MessageDelete,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const mes = message.content;

    if (!mes) return;

    const channelID = 'your-log-channel-id';
    const mChannel = await message.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Message Deleted')
    .addFields({ name: "Message Content", value: `${mes}`, inline: false})
    .addFields({ name: "Message Channel", value: `${message.channel}`, inline: false})
    .addFields({ name: "Deleted By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
  })
})
// mod logging

client.on(Events.MessageUpdate, async (message, newMessage) => {
  message.guild.fetchAuditLogs({
    type: AuditLogEvent.MessageUpdate,
  }).then(async audit => {
    const { executor } = audit.entries.first()

    const mes = message.content;

    if (!mes) return;

    const channelID = 'your-log-channel-id';
    const mChannel = await message.guild.channels.cache.get(channelID);

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Message Edited')
    .addFields({ name: "Message Content", value: `${mes}`, inline: false})
    .addFields({ name: "Message Channel", value: `${newMessage}`, inline: false})
    .addFields({ name: "Edited By", value: `${executor.tag}`, inline: false})
    .setTimestamp()
    .setFooter({ text: 'Mod logging system'})

    mChannel.send({ embeds: [embed] });
  })
})

const reportSchema = require('./schemas/reportSchema');
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'modal') {
    const contact = interaction.fields.getTextInputValue('contact')
    const issue = interaction.fields.getTextInputValue('issue')
    const description = interaction.fields.getTextInputValue('description')

    const member = interaction.user.id;
    const tag = interaction.user.tag;
    const server = interaction.guild.name;

    const embed = new EmbedBuilder()
    .setColor('Red')
    .setTimestamp()
    .addFields({ name: 'Form of contact', value: ` ${contact}`, inline: false })
    .addFields({ name: 'Issue reported', value: ` ${issue}`, inline: false })
    .addFields({ name: 'description of issue', value: ` ${description}`, inline: false })

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