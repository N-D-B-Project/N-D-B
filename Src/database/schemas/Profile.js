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
  boosters: [{ name: String, time: String }],
});

module.exports = mongoose.model("Profile", profileSchema);
