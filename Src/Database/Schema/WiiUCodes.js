const mongoose = require("mongoose");

const wiiUCodeSchema = mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
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
  WiiUCode: {
    type: String,
    required: false,
    unique: true,
  },
});

module.exports = mongoose.model("WiiUCodes", wiiUCodeSchema);