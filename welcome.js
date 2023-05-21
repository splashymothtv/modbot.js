module.exports = (client) => {
    client.on("guildMemberAdd", (member) => {
        const channelId = "748339924226277377";
        const rulesChannel = "726432899116695673";
        console.log(member);

        const message = `** Welcome to The Cucoon, <@${member.id}> Be sure to check out the ${member.guild.channel.cache.get(rulesChannel).toString()} **`;

        const channel = member.guild.channels.cache.get(channelId);
        channel.send(message);

        const dmMessage = `Welcome to ${message.guild.name}, <@${member.id}>`;

        member.send(dmMessage).catch(err);
        return;
    });
};