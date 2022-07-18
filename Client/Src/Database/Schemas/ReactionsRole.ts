import { Schema, model } from "mongoose";

const ReactionRoleSchema: Schema = new Schema({
  ID: String,
  Name: String,
  DMInfoMSG: Boolean,
  Reactions: [
    {
      message: String,
      channel: String,
      role: String,
      emoji: String,
      option: Number,
    },
  ],
});

const ReactionRole = model("ReactionRole", ReactionRoleSchema);
export default ReactionRole;
