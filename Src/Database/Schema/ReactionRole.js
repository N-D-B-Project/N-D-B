const mongoose = require("mongoose");

const ReactionRoleSchema = new mongoose.Schema({
  guildId: { type: mongoose.SchemaTypes.String },
  msgId: { type: mongoose.SchemaTypes.String },
  roleId: { type: mongoose.SchemaTypes.String },
  reaction: { type: mongoose.SchemaTypes.String },
  dm: { type: mongoose.SchemaTypes.Boolean },
  option: { type: mongoose.SchemaTypes.Number },
});

module.exports = mongoose.model("ReactionRole", ReactionRoleSchema);
