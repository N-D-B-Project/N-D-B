const mongoose = require("mongoose");

const switchCodeSchema = mongoose.Schema({
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
  SwitchCode: {
      type: String,
      required: false,
      unique: true,
  },
});

module.exports = mongoose.model("switchCode", switchCodeSchema);