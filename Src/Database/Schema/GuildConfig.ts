import * as Mongoose from "mongoose";
import { IServer } from "@Types/Shemas";
const GuildConfigSchema: IServer | Mongoose.Schema = new Mongoose.Schema({
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
  Systens: {
    AntiSpam: Boolean,
    Logs: {
      DeletedMessages: Boolean,
    },
    ReactionDM: Boolean,
  },
});

const GuildConfig = Mongoose.model("GuildConfig", GuildConfigSchema);
export default GuildConfig;
