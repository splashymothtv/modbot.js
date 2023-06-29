const { Schema, model } = require("mongoose");
const ticketSchema = new Schema({
    Guild: String,
    User: String,
    Ticket: String,
});

module.exports = model("ticketSchema", ticketSchema);