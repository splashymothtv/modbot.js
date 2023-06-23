const { Client } = require('discord.js');
const mongoose  = require('mongoose');
const mongodbURL = process.env.mongodbURL;

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.pickPresence();
    console.log(`${client.user.tag} is alive!`);
    
    setInterval(client.checkUpdates, 30000);

    if (!mongodbURL) return;

    await mongoose.connect(mongodbURL || '', {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true

    });

    if (mongoose.connect) {
      console.log("Connected to the database");
    }
  }
}
