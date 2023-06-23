const { ActivityType } = require('discord.js');

module.exports = (client) => {
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
}