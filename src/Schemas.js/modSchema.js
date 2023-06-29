const { model, Schema} = require('mongoose')

let modSchema = new Schema({
    Guild: String,
    Channel: String,
    Reason: String,
    Member: String,
})

module.exports = model("mod", modSchema)