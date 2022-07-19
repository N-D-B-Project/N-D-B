import { Schema, model, SchemaTypes } from "mongoose";

const ReactionRoleSchema: Schema = new Schema({
  ID: SchemaTypes.String,
  Name: SchemaTypes.String,
  DMInfoMSG: SchemaTypes.Boolean,
  Reactions: [
    {
      message: SchemaTypes.String,
      channel: SchemaTypes.String,
      role: SchemaTypes.String,
      emoji: SchemaTypes.String,
      option: SchemaTypes.Number,
    },
  ],
});

const ReactionRole = model("ReactionRole", ReactionRoleSchema);
export default ReactionRole;
