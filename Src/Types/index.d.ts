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
    }
  }
}

export interface EventOptions {
  name: keyof Discord.ClientEvents | keyof ProcessEvents;
  type: "on" | "once";
  emitter: "client" | "process";
}

export interface CommandOptions {
  aliases: Array<string>;
  description: string;
  category: string;
  usage: string;
  disable?: boolean;
  cooldown?: number;
  userPerms?: Array<string>;
  botPerms?: Array<string>;
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
  TestGuilds: Array<string>;
  NDB_Bugs: Array<string>;
  ServerOnly: {
    ID: Array<string>;
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
  Systens: {
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
