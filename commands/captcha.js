const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const capSchema = require('../Schemas.js/capSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('captcha')
        .setDescription('Captcha verification')
        .addSubcommand(command => command.setName('setup')
            .setDescription('Set up the captcha verification system')
            .addRoleOption(option => option.setName('role').setDescription('The role you want to assign upon captcha')
                .setRequired(true)).addStringOption(option => option.setName('captcha').setDescription('The captcha text you want in the image').setRequired(true)))
        .addSubcommand(command => command.setName('disable').setDescription('SDisable the captcha verification system')),
        async execute(interaction) {

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({
                content: `You must have admin perms in order to use this command!`, ephemeral: true
            });

            const Data = await capSchema.findOne({ guild: interaction.guild.id });

            const { options } = interaction;
            const sub = options.getSubcommand();

            switch (sub) {
                case 'setup':

                if (Data) return await interaction.reply({
                    content: `The captcha system has already been set up here!`, ephemeral: true
                });
                else {
                    const role = options.getRole('role');
                    const captcha = options.getString('captcha');

                    await capSchema.create({
                        Guild: interaction.guild.id,
                        Role: role.id,
                        Captcha: captcha,
                    })

                    const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription('✅: The captcha system is working')

                    await interaction.reply({ embeds: [embed] });
                }

                break;
                case 'disable':

                if (!Data) return await interaction.reply({ content: `There is no captcha system set up here!`, ephemeral: true });
                else {
                    await capSchema.deleteMany({ guild: interaction.guild.id });

                    const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('❗: The captcha system has been disabled')

                    await interaction.reply({ embeds: [embed] });
                }
            }
        }

}