import * as Mongoose from "mongoose";

export interface IServer {
  ID: String;
  Name: String;
  Settings: {
    Prefix: String;
    Language: String;
  };
  Channels: {
    Logs: Number;
    Flood: Number;
  };
  Roles: {
    Default: Number;
    Muted: Number;
  };
  Systens: {
    AntiSpam: Boolean;
    Logs: {
      DeletedMessages: Boolean;
    };
    ReactionDM: Boolean;
  };
}

export interface IUser {
  ID: String;
  Username: String;
  NDCash: {
    NDCash: Number;
    Emprego: String;
    Level: Number;
    Worked: Number;
    Propina: Number;
    X2Time: Boolean;
    Daily: Number;
  };
  Bag: {
    Gifts: Number;
  }
}