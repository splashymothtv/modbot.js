const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('webhook')
    .setDescription('Manage and edit your webhooks.')
    .addSubcommand(command => command.setName('create').setDescription('Creates a webhook for specified channel.').addChannelOption(option => option.setName('channel').setDescription('Your webhook will be created in specified channel.').addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(option => option.setName('name').setDescription(`Specified name will be your new webhook's name.`).setRequired(true).setMinLength(1).setMaxLength(80)).addStringOption(option => option.setName('icon-url').setDescription(`Specified icon will be your new webhook's icon.`).setMinLength(5).setMaxLength(100)))
    .addSubcommand(command => command.setName('edit').setDescription('Edits a webhook for you.').addStringOption(option => option.setName('webhook-id').setDescription('Specify the ID of your webhook.').setMinLength(10).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('webhook-token').setDescription('Specify the token of your webhook.').setMinLength(10).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('new-name').setDescription(`Specified name will be your webhook's updated name.`).setRequired(true).setMinLength(1).setMaxLength(80)))
    .addSubcommand(command => command.setName('delete').setDescription('Deletes a webhook for you.').addStringOption(option => option.setName('webhook-id').setDescription('Specify the ID of your webhook.').setMinLength(10).setMaxLength(200).setRequired(true)).addStringOption(option => option.setName('webhook-token').setDescription('Specify the token of your webhook.').setRequired(true).setMinLength(10).setMaxLength(200))),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
        
        const sub = interaction.options.getSubcommand();
        
        switch (sub) {
            case 'create':

            await interaction.deferReply({ ephemeral: true });

            const name = await interaction.options.getString('name');
            const icon = await interaction.options.getString('icon-url') || 'https://cdn.discordapp.com/avatars/560414664073150464/a1b7b47ae43884781120c7e1474b1155.webp';
            const channel = await interaction.options.getChannel('channel');

            const webhook = await channel.createWebhook({
                name: name,
                avatar: icon,
                channel: channel
            }).catch(err => {
                return interaction.editReply({ content: `I do not have the **ManagWebhooks** permission.`})
            }) 

            const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription('> Webhook Created')
            .addFields({ name: `Webhook Name`, value: `> ${name}`, inline: true})
            .addFields({ name: `Webhook Channel`, value: `> ${channel}`, inline: true})
            .addFields({ name: `Webhook URL`, value: `> https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`, inline: true})
            .addFields({ name: `Webhook Icon`, value: `> ${icon}`})

            await interaction.editReply({ embeds: [embed], ephemeral: true });

            try {
                await webhook.send({ embeds: [new EmbedBuilder().setColor('Purple').setDescription('Hello from your **brand new** webhook!')]});
            } catch (err) {
                return;
            }
           
            break;
            case 'edit':

            await interaction.deferReply({ ephemeral: true });

            const token = await interaction.options.getString('webhook-token');
            const id = await interaction.options.getString('webhook-id');
            let newname = await interaction.options.getString('new-name');

            const editwebhook = await interaction.guild.fetchWebhooks();

            await Promise.all(editwebhook.map(async webhook => {

                if (webhook.token !== token || webhook.id !== id) await interaction.editReply({ content: `🔍 **Searching**.. no **results** yet!`})
                else {

                    if (!newname) newname = webhook.name;
                    let oldname = webhook.name;

                    await webhook.edit({
                        name: newname
                    }).catch(err => {
                        return interaction.editReply({ content: `**Oops!** Something went wrong, perhaps I am **missing permissions**.`})
                    })

                    const embed = new EmbedBuilder()
                    .setColor('Purple')
                    .setDescription('> Edited Webhook')
                    .addFields({ name: `Webhook Name`, value: `> ${oldname} => ${newname}`, inline: true})

                    await interaction.editReply({ embeds: [embed], content: `` });

                }

            }))

            break;
            case 'delete':

            await interaction.deferReply({ ephemeral: true });

            const deltoken = await interaction.options.getString('webhook-token');
            const delid = await interaction.options.getString('webhook-id');

            const delwebhook = await interaction.guild.fetchWebhooks();

            await Promise.all(delwebhook.map(async webhook => {

                if (webhook.token !== deltoken || webhook.id !== delid) await interaction.editReply({ content: `🔍 **Searching**.. no **results** yet!`})
                else {

                    await webhook.delete().catch(err => {
                        return interaction.editReply({ content: `Something went wrong! I think I am **missing permissions**!`})
                    })

                    await interaction.editReply({ content: `🚧 **Deleted** your webhook!` });

                }
            }))
        }
    }
}