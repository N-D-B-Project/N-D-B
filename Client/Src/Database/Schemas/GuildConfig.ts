import { Schema, model, SchemaTypes } from "mongoose";
const GuildConfigSchema: Schema = new Schema({
  ID: SchemaTypes.String,
  Name: SchemaTypes.String,
  Settings: {
    Prefix: SchemaTypes.String,
    Language: SchemaTypes.String,
  },
  Channels: {
    Logs: SchemaTypes.Number,
    Flood: SchemaTypes.Number,
  },
  Roles: {
    Default: SchemaTypes.Number,
    Muted: SchemaTypes.Number,
  },
  Systems: {
    AntiSpam: SchemaTypes.Boolean,
    Logs: {
      DeletedMessages: SchemaTypes.Boolean,
    },
    ReactionDM: SchemaTypes.Boolean,
  },
});

const GuildConfig = model("GuildConfig", GuildConfigSchema);
export default GuildConfig;
