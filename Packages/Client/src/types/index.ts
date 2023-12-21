import { CommandsDiscovery } from "@/modules/commands/Commands.discovery";
import { LocalizationMap } from "discord-api-types/v10";
import {
  BaseMessageOptions,
  Collection,
  CommandInteraction,
  EmbedBuilder,
  GuildChannel,
  Message,
  PartialMessage,
  PermissionResolvable,
  SlashCommandBuilder
} from "discord.js";
import { Context } from "vm";
export interface AlsStore {
  PrismaConnected: boolean;
  LegacyCommands: Collection<string, CommandsDiscovery>;
  Aliases: Collection<string, string>;
  SlashCommands: Collection<string, CommandsDiscovery>;
  SubCommands: Collection<string, CommandsDiscovery>;
}

export type Content = string | EmbedBuilder | BaseMessageOptions;

export type ENVIRONMENT = "DEVELOPMENT" | "PRODUCTION";
export interface Config {
  ENVIRONMENT: ENVIRONMENT;
  Database: {
    Version: string;
    URL: string;
    Name: string;
    Password: string;
    Redis: {
      Port: string;
      Host: string;
    };
  };
  Discord: {
    Token: string;
    DevToken: string;
    Client: {
      Owners: Array<string>;
      Secret: string;
      ID: string;
    };
    Servers: {
      NDCommunity: string;
      TestGuild: string;
    };
  };
  Debug: {
    Client: boolean;
    Translations: boolean;
    Lavalink: boolean;
    PremiumMusicPlayer: boolean;
  };
  Music: {
    Lavalink: boolean;
    Volumes: {
      Lavalink: number;
      Player: number;
    };
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
  Emojis: {
    logo: string;
    fail: string;
    accept: string;
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
  URLList: {
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
  EvalBadKeys: Array<string>;
}

export interface CommandOptions {
  legacy?: {
    name: string;
    aliases?: Array<string>;
    description: string;
    usage: string;
    args?: {
      min: number;
      max: number;
    };
  };
  permissions: {
    user: Array<PermissionResolvable>;
    bot: Array<PermissionResolvable>;
    guildOnly?: boolean;
    ownerOnly?: boolean;
  };
  category: string;
  disable?: boolean;
  cooldown?: number;
  slash?: {
    data?: Partial<SlashCommandBuilder>;
    deployMode?: "Test" | "Guild" | "Global";
    type: "Main" | "Sub" | "Group";
    name?: string;
  };
}

export interface Localization {
  name: LocalizationMap;
  description: LocalizationMap;
  options?: {
    [key: string]: Localization;
  };
}

export enum DatabaseStatus {
  "Created",
  "Error"
}

export type TranslateInfo =
  | Message
  | CommandInteraction
  | GuildChannel
  | PartialMessage
  | Context;
