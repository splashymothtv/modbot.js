const { Schema, model } = require("mongoose");
const validateInteger = require("mongoose-integer");

const timeoutSchema = new Schema({
  Guild: {
    type: String,
    required: true,
  },
  Reason: {
    type: String,
    required: true,
  },
  Member: {
    type: String,
    required: true,
  },
  Number: {
    type: Number,
    required: true,
    unique: true,
    integer: true,
  },
});

timeoutSchema.plugin(validateInteger);
module.exports = model("timeout", timeoutSchema);
