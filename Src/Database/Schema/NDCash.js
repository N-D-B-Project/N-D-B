const mongoose = require("mongoose");

const NDCashSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  emprego: {
    type: String,
    default: "Desempregado",
  },
  level: {
    type: Number,
    default: 1,
  },
  worked: {
    type: Number,
    default: 0
  },
  skin: {
    type: String,
    default: "Default",
  },
  ndcash: {
    type: Number,
    default: 0,
  },
  propina: {
    type: Number,
    default: 0,
  },
  x2time: {
    type: Boolean,
    default: false,
  },
  daily: {
    type: Number,
  },
});

module.exports = mongoose.model("NDCash", NDCashSchema);
