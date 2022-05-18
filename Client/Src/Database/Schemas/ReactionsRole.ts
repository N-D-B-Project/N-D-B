import * as Mongoose from "mongoose";
import { IRR } from "~/Types";

const ReactionRoleSchema: IRR | Mongoose.Schema = new Mongoose.Schema({
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

const ReactionRole = Mongoose.model("ReactionRole", ReactionRoleSchema);
export default ReactionRole;
