const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
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
  },
  skin: {
    type: mongoose.SchemaTypes.String,
  },
  ndcash: {
    type: Number,
    default: 0,
  },
  propina: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  boosters: [{ name: String, time: String }],
});

module.exports = mongoose.model("Profile", profileSchema);
