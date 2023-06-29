const { Schema, model } = require("mongoose");

let joinleaveSchema = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model("joinleave", joinleaveSchema);