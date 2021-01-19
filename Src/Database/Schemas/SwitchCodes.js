const mongoose = require("mongoose");

const switchCodeSchema = mongoose.Schema({
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
  SwitchCode: {
      type: mongoose.SchemaTypes.String,
      required: false,
      unique: true,
  },
});

module.exports = mongoose.model("switchCode", switchCodeSchema);