import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";
import * as Express from "express";

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      //! Discord API
      Token: string;
      DevToken: string;
      Secret: string;
      ID: string;
      Name: string;
      Icon: string;

      //@ Database
      MongoURI: string;
      MongoURILocalHost: string;

      //# APIs
      SCApi_Secret: string;
      TopGG_Token: string;
    }
  }
}

export interface EventOptions {
  name:
    | keyof Discord.ClientEvents
    | keyof Discord.ClientRestEvents //WTF???
    | keyof ProcessEvents
    | keyof EmitedEvents
    | keyof MusicEvents;
  type: "on" | "once";
  emitter: "client" | "rest" | "music" | "process";
}

export interface CommandOptions {
  name: string;
  aliases: Array<string>;
  description: string;
  category: string;
  usage: string;
  disable?: boolean;
  cooldown?: number;
  permissions: {
    user: Array<Discord.PermissionResolvable>;
    bot: Array<Discord.PermissionResolvable>;
  };
  minArgs?: number;
  maxArgs?: number;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  nsfw?: boolean;
  ndcash?: number;
  DM?: boolean;
  SlashOptions?: Discord.ApplicationCommandData;
}

export type ConfigType = {
  Prefix: string;
  Owners: Array<string>;
  TestGuilds: {
    ID: Array<string>;
  };
  NDB_Bugs: Array<string>;
  ServerOnly: {
    ID: Array<string>;
  };
  Music: {
    Lavalink: boolean;
    Player: {
      AutoLeaveEmpty: {
        Channel: {
          Enable: boolean;
          Delay: number;
        };
        Queue: {
          Enable: boolean;
          Delay: number;
        };
      };
    };
    Client: {
      selfDeaf: boolean;
      serverDeaf: boolean;
    };
  };
  Sharding: {
    enable: boolean;
    spawnDelay: number;
    spawnTimeout: number;
    serversPerShard: number;
    shardCount: number;
    callbackUrl: string;
    RootServiceUrl: string;
  };
  APIs: {
    SCAPI: {
      Jobs: {
        ScheduleCluster: string;
        ScheduleServer: string;
        Log: true;
      };
      Port: number;
      Port2: number;
    };
  };
  Debug: {
    Client: boolean;
    DatabaseSave: boolean;
    SlashCommands: boolean;
    Sharding: {
      enable: boolean;
      mode: string;
    };
  };
};

export interface ProcessEvents {
  beforeExit;
  exit;
  uncaughtException;
  uncaughtExceptionMonitor;
  unhandledRejection;
  multipleResolves;
  rejectionHandled;
}

export interface EmitedEvents {
  Command;
  React;
  GuildOnly;
  AutoComplete;
  ButtonClick;
  ContextMenu;
  SelectMenu;
  SlashCommand;
  ReactionRoleAdd;
  ReactionRoleRemove;
}

export interface MusicEvents {
  nodeConnect;
  nodeCreate;
  nodeDisconnect;
  nodeError;
  nodeReconnect;
  playerCreate;
  playerDestroy;
  playerMove;
  queueEnd;
  trackError;
  trackException;
  trackStart;
  trackStuck;
}

export interface IServer {
  ID: string;
  Name: string;
  Settings: {
    Prefix: string;
    Language: string;
  };
  Channels: {
    Logs: number;
    Flood: number;
  };
  Roles: {
    Default: number;
    Muted: number;
  };
  Systems: {
    AntiSpam: boolean;
    Logs: {
      DeletedMessages: boolean;
    };
    ReactionDM: boolean;
  };
}

export interface IUser {
  ID: string;
  Username: string;
  NDCash: {
    NDCash: number;
    Emprego: string;
    Level: number;
    Worked: number;
    Propina: number;
    X2Time: boolean;
    Daily: number;
  };
  Bag: {
    Gifts: number;
  };
  Guilds: [
    {
      ID: string;
      Name: string;
      XP: number;
      Level: number;
    }
  ];
}

export interface IRR {
  ID: string;
  Name: string;
  DMInfoMSG: boolean;
  Reactions: [
    {
      message: string;
      channel: string;
      role: string;
      emoji: string;
      option: number;
    }
  ];
}

export interface Controller {
  path: string;
  router: Express.Router;
  authToken?: string;
  register(): void;
}

export interface Job {
  name: string;
  log: boolean;
  schedule: string;
  run(): Promise<void>;
}

export type ColorsType = {
  Client: {
    Green: string;
    Red: string;
  };
};

export type EmojisType = {
  fail: string;
  success: string;
  thing: string;
  loading: string;
  loading2: string;
  delayping: string;
  Music: {
    Youtube: string;
    Spotify: string;
    SoundCloud: string;
    Deezer: string;
    Facebook: string;
    Apple: string;
  };
};

export type URLListType = {
  Music: {
    Youtube: string;
    ShortYoutube: string;
    SoundCloud: string;
    Spotify: string;
    Deezer: string;
    Facebook: string;
    Apple: string;
  };
};

export type CommandType = {
  INTERACTION;
  MESSAGE;
};

export interface ReactionsType {
  message: string;
  channel: string;
  role: string;
  emoji: string;
  option: REACTION_OPTIONS;
}

enum REACTION_OPTIONS {
  1,
  2,
  3,
  4,
  5,
  6,
}
