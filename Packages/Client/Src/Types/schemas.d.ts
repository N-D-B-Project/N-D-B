import NDBClient from "~/Client/NDBClient";
import { type Model, type Document } from "mongoose";
import { Message, Interaction, User } from "discord.js";

export interface IGuild {
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
  ReactionRoles: [
    {
      message: string;
      channel: string;
      role: string;
      emoji: string;
      option: number;
    }
  ];
  Systems: {
    AntiSpam: boolean;
    Logs: {
      DeletedMessages: boolean;
      ReactionDM: boolean;
    };
  };
}

export interface IGuildConfigModel extends Model<IGuild, {}, IGuildMethods> {
  getGuildConfig(Guild: Guild): Promise<Document<IGuild, IGuildMethods>>;
  getReactionRoles(Guild: Guild): Promise<Array<IReactionSchema>>;

  CreateConfig(client: NDBClient, Guild: Guild): Promise<void>;
  DeleteConfig(client: NDBClient, Guild: Guild): Promise<void>;
  UpdateConfig(
    client: NDBClient,
    oldGuild: Guild,
    newGuild: Guild
  ): Promise<void>;
}

export interface IGuildMethods {}

export interface IReactionSchema {
  message: string;
  channel: string;
  role: string;
  emoji: string;
  option: number;
}

export interface IUser {
  ID: string;
  Username: string;
  Settings: {
    Prefix: string;
    Language: string;
  };
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

export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  getUser(User: User): Promise<Document<IUser, IGuildMethods>>;
  CreateUser(client: NDBClient, User: User): Promise<void>;
  DeleteUser(client: NDBClient, User: User): Promise<void>;
  UpdateUser(client: NDBClient, User: User): Promise<void>;
  AddGuild(client: NDBClient, MsgInt: Message | Interaction): Promise<void>;
  RemoveGuild(client: NDBClient, MsgInt: Message | Interaction): Promise<void>;
}

export interface IUserMethods {}

export enum EUserJobs {
  Jobless = "Jobless",
}
