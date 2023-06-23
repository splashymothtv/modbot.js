const { Schema, model } = require('mongoose');

let notifySchema = new Schema({
    _id: Schema.Types.ObjectId,
    Guild: String,
    ID: String,
    Channel: String,
    Latest: Array,
    Message: String,
    PingRole: String,
})

module.exports = model('notif', notifySchema);