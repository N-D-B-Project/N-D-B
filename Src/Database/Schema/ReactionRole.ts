import * as Mongoose from "mongoose";

const ReactionRoleSchema: Mongoose.Schema = new Mongoose.Schema({
  guildId: { type: String },
  msgId: { type: String },
  roleId: { type: String },
  reaction: { type: String },
  dm: { type: Boolean },
  option: { type: Number },
});

const ReactionRole = Mongoose.model("ReactionRole", ReactionRoleSchema);
export default ReactionRole;
