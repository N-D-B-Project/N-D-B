const mongoose = require("mongoose");

const steamProfileSchema = mongoose.Schema({
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
  SteamProfile: {
    type: mongoose.SchemaTypes.String,
    unique: true,
  },
});

module.exports = mongoose.model("SteamProfile", steamProfileSchema);
