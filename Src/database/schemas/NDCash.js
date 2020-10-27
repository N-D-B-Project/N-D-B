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
  daily: {
    type: Number,
  },
});

module.exports = mongoose.model("NDCash", NDCashSchema);
