import NDBClient from "@Client/NDBClient";
import { RestEvents } from "@discordjs/rest";
import {
  ClientEvents,
  type PermissionResolvable,
  type ApplicationCommandData,
} from "discord.js";

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
    | keyof ClientEvents
    | keyof RestEvents
    | keyof EmitedEvents
    | keyof ProcessEvents;
  type: "on" | "once";
  emitter: "client" | "rest" | "process";
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
    user: Array<PermissionResolvable>;
    bot: Array<PermissionResolvable>;
  };
  minArgs?: number;
  maxArgs?: number;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  nsfw?: boolean;
  ndcash?: number;
  DM?: boolean;
  SlashOptions?: ApplicationCommandData;
}

export enum CommandType {
  INTERACTION = "Interaction",
  MESSAGE = "Message",
  CONTEXT = "Context",
  MODAL = "Modal",
}

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
  ModalSubmit;
  SlashCommand;
  ReactionRoleAdd;
  ReactionRoleRemove;
}

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
