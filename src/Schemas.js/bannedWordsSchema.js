const { Schema, model } = require("mongoose");
const bannedWordsSchema = new Schema({
  Guild: String,
  Channel: String,
  Msg: String,
  Role: String,
});

module.exports = model("bannedWordsSchema", bannedWordsSchema);
