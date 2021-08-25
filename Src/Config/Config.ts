import * as Discord from "discord.js";
require("dotenv").config();
import "@Types/env";

export interface Config {
  Token: string;
  prefix: string;
  owners: Array<string>;
  testGuilds: Array<string>;
  NDB_Bugs: Array<string>;
  defaultPerms: Array<string>;
  lavalink: boolean;
  autoposter: boolean;
  Language: string;
  Debug: {
    DatabaseSave: boolean;
    SlashCommands: boolean;
  }
}

export const EnvConfig = {
  Discord: {
    Token: process.env.Token,
    DevToken: process.env.DevToken,
    Secret: process.env.Secret,
    ID: process.env.ID,
    Name: process.env.Name,
    Icon: process.env.Icon,
  },
  Datastore: {
    MongoURI: process.env.MongoURI,
    MongoURILocalHost: process.env.MongoURILocalHost,
  },
  Lavalink: {
    LavalinkHOST: process.env.LavalinkHOST,
    LavalinkPORT: process.env.LavalinkPORT,
    LavalinkPassword: process.env.LavalinkPassword,
    SpotifyID: process.env.SpotifyID,
    SpotifySecret: process.env.SpotifySecret,
  },
  TopGG: {
    Token: process.env.TopGGToken,
  },
};

export interface Emojis {
  fail: string;
  success: string;
  thing: string;
  loading: string;
  loading2: string;
  delayping: string;
}

export const ClientConfig: Discord.ClientOptions = {
  messageCacheLifetime: 10000,
  messageSweepInterval: 12000,
  restTimeOffset: 0,
  shards: "auto",
  restWsBridgeTimeout: 100,
  allowedMentions: { parse: ["users", "roles"] },
  partials: [
    Discord.Constants.PartialTypes.CHANNEL,
    Discord.Constants.PartialTypes.GUILD_MEMBER,
    Discord.Constants.PartialTypes.MESSAGE,
    Discord.Constants.PartialTypes.REACTION,
    Discord.Constants.PartialTypes.USER,
  ],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
};
