import { Schema, model } from "mongoose";
import { IServer } from "~/Types";
const GuildConfigSchema: Schema = new Schema<IServer>({
  ID: String,
  Name: String,
  Settings: {
    Prefix: String,
    Language: String,
  },
  Channels: {
    Logs: Number,
    Flood: Number,
  },
  Roles: {
    Default: Number,
    Muted: Number,
  },
  Systems: {
    AntiSpam: Boolean,
    Logs: {
      DeletedMessages: Boolean,
    },
    ReactionDM: Boolean,
  },
});

const GuildConfig = model("GuildConfig", GuildConfigSchema);
export default GuildConfig;
