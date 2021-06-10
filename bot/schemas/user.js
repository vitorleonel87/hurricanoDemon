const { model, Schema } = require("mongoose");

module.exports = model(
  "user",
  new Schema({
    name: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Array,
      default: [],
    },
    wallet: {
      type: String,
      default: "0",
    },
    job: {
      type: String,
      default: "none",
    },
    bank: {
      type: String,
      default: "0",
    },
    cooldowns: {
      type: Object,
      default: {},
    },
    birthday: {
      type: String,
      allowNull: true,
      default: null,
    },
  })
);
