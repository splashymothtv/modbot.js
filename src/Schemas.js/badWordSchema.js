const { Schema, model } = require("mongoose");
const badWordSchema = new Schema({
    Guild: String,
    Channel: String,
    Msg: String,
    Word: String,
});

module.exports = model("badWordSchema", badWordSchema);