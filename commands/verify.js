const { SlashCommandBuilder, } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,  } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('verify')
  .setDescription('verify a user'),
  async execute (interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return await interaction.reply({ content: "Only admins can create a verification message!"});

    const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('button')
      .setEmoji("✅")
      .setLabel('Verify')
      .setStyle(ButtonStyle.Success),
    )

    const embed = new EmbedBuilder()
    .setColor('Purple')
    .setTitle('Server verification')
    .setDescription('Get verified in the server')

    await interaction.reply({ embeds: [embed], components: [button] });

    const collector = await interaction.channel.createMessageComponentCollector();

    collector.on('collect', async i => {
      await i .update({ embeds: [embed], components: [button] });
      const role = interaction.guild.roles.cache.find(r => r.name === 'verified');
      const member = i.member;
      member.roles.add(role);
      i.user.send(`You are now verified in: **${i.guild.name}**`).catch(err => {
        return;
      })
      
    })
  }
}