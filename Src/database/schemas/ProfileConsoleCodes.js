const mongoose = require("mongoose");

const profileCodeSchema = mongoose.Schema({
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
  ThreeDSCode: {
    type: mongoose.SchemaTypes.String,
    unique: true,
  },
  WiiUCode: {
    type: mongoose.SchemaTypes.String,
    unique: true,
  },
  SwitchCode: {
      type: mongoose.SchemaTypes.String,
      unique: true,
  },
});

module.exports = mongoose.model("ProfileCode", profileCodeSchema);
