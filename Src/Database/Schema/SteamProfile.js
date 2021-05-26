const mongoose = require("mongoose");

const steamProfileSchema = mongoose.Schema({
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
  SteamProfile: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("SteamProfile", steamProfileSchema);
