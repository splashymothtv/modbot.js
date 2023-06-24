const { model, Schema } = require("mongoose");

let reports = new Schema({
  User: String,
  Guild: String,
  Channel: String,
});

module.exports = model("reports", reports);
