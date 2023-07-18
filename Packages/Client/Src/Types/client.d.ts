/* eslint-disable no-shadow */
import { ErelaEvents } from "@/Modules/Music/Types";
import type { RestEvents } from "@discordjs/rest";
import type {
  AnySelectMenuInteraction,
  ApplicationCommandData,
  AutocompleteInteraction,
  ButtonInteraction,
  ClientEvents,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageReaction,
  ModalSubmitInteraction,
  PartialMessageReaction,
  PartialUser,
  PermissionResolvable,
  User
} from "discord.js";

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
  deployMode: "Test" | "Guild" | "Global";
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
  deployMode: "Test" | "Guild" | "Global";
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
  MODAL = "Modal"
}

export interface EventOptions {
  name:
    | keyof ClientEvents
    | keyof RestEvents
    | keyof EmitedEvents
    | keyof ProcessEvents
    | keyof ErelaEvents;
  type: "on" | "once";
  emitter: "client" | "rest" | "process" | "music";
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
  Command: [message: Message];
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

export interface SwitchCommand {
  MsgInt: Message | CommandInteraction;
  args: Array<string> | CommandInteractionOptionResolver;
}
