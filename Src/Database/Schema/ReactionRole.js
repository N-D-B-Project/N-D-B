const mongoose = require("mongoose");

const ReactionRoleSchema = new mongoose.Schema({
  guildId: { type: String },
  msgId: { type: String },
  roleId: { type: String },
  reaction: { type: String },
  dm: { type: Boolean },
  option: { type: Number },
});

module.exports = mongoose.model("ReactionRole", ReactionRoleSchema);
