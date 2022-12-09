import NDBClient from "@Client/NDBClient";
import { RestEvents } from "@discordjs/rest";
import {
  ClientEvents,
  PermissionResolvable,
  ApplicationCommandData,
  User,
  Guild,
  Message,
  AutocompleteInteraction,
  ButtonInteraction,
  ContextMenuCommandInteraction,
  SelectMenuInteraction,
  ModalSubmitInteraction,
  CommandInteraction,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
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
      AuthNDC;

      //# APIs
      SCApi_Secret: string;
      TopGG_Token: string;

      //% Run Args
      isCompiled: string;
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
  enable?: boolean;
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
}

export interface SlashCommandOptions {
  data: ApplicationCommandData;
  category: string;
  permissions: {
    user: Array<PermissionResolvable>;
    bot: Array<PermissionResolvable>;
  };
  guildOnly?: boolean;
  ownerOnly?: boolean;
  disable?: boolean;
  cooldown?: number;
  nsfw?: boolean;
  ndcash?: number;
}

export interface SubCommandOptions {
  name: string;
  category: string;
  permissions: {
    user: Array<PermissionResolvable>;
    bot: Array<PermissionResolvable>;
  };
  guildOnly?: boolean;
  ownerOnly?: boolean;
  disable?: boolean;
  cooldown?: number;
  nsfw?: boolean;
  ndcash?: number;
}

export enum eCommandType {
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
  Command: [message: Message];
  DMCommand: [message: Message];
  AutoComplete: [interaction: AutocompleteInteraction];
  ButtonClick: [interaction: ButtonInteraction];
  ContextMenu: [interaction: ContextMenuCommandInteraction];
  SelectMenu: [interaction: SelectMenuInteraction];
  ModalSubmit: [interaction: ModalSubmitInteraction];
  SlashCommand: [interaction: CommandInteraction];
  ReactionRoleAdd: [
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ];
  ReactionRoleRemove: [
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ];
}
