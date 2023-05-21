const { ActivityType } = require('discord.js');
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const options = [
			{
				type: ActivityType.Watching,
				text: "over the server",
				status: "online"
			},
			{
				type: ActivityType.Listening,
				text: "for commands",
				status: "idle"
			}
		]
	},
};