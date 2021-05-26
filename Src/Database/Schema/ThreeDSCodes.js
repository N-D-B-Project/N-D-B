const mongoose = require("mongoose");

const threeDSCodeSchema = mongoose.Schema({
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
  ThreeDSCode: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("ThreeDSCode", threeDSCodeSchema);
