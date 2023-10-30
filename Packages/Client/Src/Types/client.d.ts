/* eslint-disable no-shadow */
import {
  LavalinkManagerEvents,
  NodeManagerEvents
} from "@/Modules/Music/Types";
import type { RestEvents } from "@discordjs/rest";
import type {
  AnySelectMenuInteraction,
  ApplicationCommandData,
  AutocompleteInteraction,
  BaseMessageOptions,
  ButtonInteraction,
  ClientEvents,
  CommandInteraction,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Message,
  MessageReaction,
  ModalSubmitInteraction,
  PartialMessageReaction,
  PartialUser,
  PermissionResolvable,
  User
} from "discord.js";
import { SignalConstants } from "os";

export interface CommandOptions {
  name: string;
  aliases: Array<string>;
  description: string;
  category: string;
  usage: string;
  permissions: {
    user: Array<PermissionResolvable>;
    bot: Array<PermissionResolvable>;
    guildOnly?: boolean;
    ownerOnly?: boolean;
  };
  disable?: boolean;
  cooldown?: number;
  minArgs?: number;
  maxArgs?: number;
  nsfw?: boolean;
  ndcash?: number;
  DM?: boolean;
  slash?: {
    data?: ApplicationCommandData;
    deployMode?: "Test" | "Guild" | "Global";
    type: "Main" | "Sub" | "Group";
    name?: string;
  };
}

export type Content = string | EmbedBuilder | BaseMessageOptions;

export enum eCommandType {
  INTERACTION = "Interaction",
  MESSAGE = "Message",
  CONTEXT = "Context",
  MODAL = "Modal"
}
export interface EventOptions {
  name:
    | keyof ClientEvents
    | keyof RestEvents
    | keyof EmitedEvents
    | keyof NodeManagerEvents
    | keyof LavalinkManagerEvents
    | "process";
  names?: Array<keyof ProcessEvents | keyof SignalConstants>;
  type: "on" | "once";
  emitter: "client" | "rest" | "process" | "music" | "music-node";
  enable: boolean;
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
  Command: [message: Message, Prefix: string, Premium: boolean];
  DMCommand: [message: Message];
  NotQuiteNitro: [message: Message, emojis: RegExpMatchArray];
  AutoComplete: [interaction: AutocompleteInteraction];
  ButtonClick: [interaction: ButtonInteraction];
  ContextMenu: [interaction: ContextMenuCommandInteraction];
  SelectMenu: [interaction: AnySelectMenuInteraction];
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

export declare const Colors: {
  NDBGreen: 0x00c26f;
  NDBRed: 0xc20e00;
};
