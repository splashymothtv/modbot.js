module.exports = {
  data: {
    name: `verify`,
  },
  async execute(interaction, client) {
    await interaction.reply({ embeds: [embed], components: [button] });
  },
};
