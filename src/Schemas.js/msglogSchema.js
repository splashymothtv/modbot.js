const { model, Schema } = require("mongoose");

let msglogSchema = new Schema({
  guildId: { type: String, required: true },
  msgChannelId: { type: String, required: true },
  Msg: { type: String, required: true },
});

module.exports = model("msglog", msglogSchema);
