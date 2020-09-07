const mongoose = require("mongoose");

const threeDSCodeSchema = mongoose.Schema({
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
});

module.exports = mongoose.model("ThreeDSCode", threeDSCodeSchema);
