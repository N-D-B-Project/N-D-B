const mongoose = require("mongoose");

const NDCashSchema = mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  emprego: {
    type: mongoose.SchemaTypes.String,
    default: "Desempregado",
  },
  level: {
    type: mongoose.SchemaTypes.Number,
    default: 1,
  },
  worked: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  skin: {
    type: mongoose.SchemaTypes.String,
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
    type: mongoose.SchemaTypes.Boolean,
    default: false,
  },
  daily: {
    type: Number,
  },
});

module.exports = mongoose.model("NDCash", NDCashSchema);
