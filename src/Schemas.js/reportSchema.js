const { Schema, model } = require("mongoose");
const reportSchema = new Schema({
  Guild: String,
  Channel: String,
  Msg: String,
  Role: String,
});

module.exports = model("reportSchema", reportSchema);
