const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
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
  boosters: { name: String, time: String },
  lastVote: {
    type: Number,
    default: 0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Profile", profileSchema);
