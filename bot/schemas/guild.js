const { model, Schema } = require("mongoose");

module.exports = model(
  "guild",
  new Schema({
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: "hr!",
    },
    disabledModules: {
      type: Array,
      default: ["levelling"],
    },
    disabledCommands: {
      type: Array,
      default: [],
    },
  })
);
