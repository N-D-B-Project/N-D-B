import { Schema, model } from "mongoose";
import { IRR } from "~/Types";

const ReactionRoleSchema: Schema = new Schema<IRR>({
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
