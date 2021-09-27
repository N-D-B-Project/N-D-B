import "dotenv/config";

export type Config = {
  Prefix: string;
  Owners: Array<string>;
  TestGuilds: Array<string>;
  NDB_Bugs: Array<string>;
  defaultPerms: Array<string>;
  Lavalink: boolean;
  AutoPoster: boolean;
  Language: string;
  Debug: {
    Client: boolean;
    DatabaseSave: boolean;
    SlashCommands: boolean;
  }
}

export const Config: Config = {
  Prefix: "&",
  Owners: ["330047048009252864", "336678075611873281"],
  TestGuilds: ["717094267243462688"],
  NDB_Bugs: ["800847836139880458", "800847760046948370"],
  defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL"],
  Lavalink: true,
  AutoPoster: true,
  Language: "pt-BR",
  Debug: {
    Client: false,
    DatabaseSave: true,
    SlashCommands: false
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
