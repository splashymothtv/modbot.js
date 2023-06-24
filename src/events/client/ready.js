const { Events } = require("discord.js");
const mongoose = require("mongoose");
const mongoLogin = require("./config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
