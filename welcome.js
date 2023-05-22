module.exports = (client) => {
    client.on("guildMemberAdd", (member) => {
        const channelId = "your-welcChannel-id";
        const rulesChannel = "your-rulesChannel-id";
        console.log(member);

        const message = `** Welcome to The server, <@${member.id}> Be sure to check out the ${member.guild.channel.cache.get(rulesChannel).toString()} **`;

        const channel = member.guild.channels.cache.get(channelId);
        channel.send(message);

        const dmMessage = `Welcome to ${message.guild.name}, <@${member.id}>`;

        member.send(dmMessage).catch(err);
        return;
    });
};
