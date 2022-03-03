import * as Discord from "discord.js";
import { TFunction } from "i18next";
import BaseEvent from "@Structures/BaseEvent";
import BaseCommand from "@Structures/BaseCommand";

export const ClientOptions: Discord.ClientOptions = {
  messageCacheLifetime: 10000,
  restTimeOffset: 0,
  shards: "auto",
  restWsBridgeTimeout: 100,
  failIfNotExists: false,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "GUILD_SCHEDULED_EVENT",
    "MESSAGE",
    "REACTION",
    "USER",
  ],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  ],
  makeCache: Discord.Options.cacheWithLimits({
    ...Discord.Options.defaultMakeCacheSettings,
    MessageManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
    ThreadManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
    ThreadMemberManager: {
      maxSize: 2,
      sweepInterval: 60 * 60,
    },
  }),
};

export class Collections {
  public constructor(
    public commands: Discord.Collection<
      string,
      BaseCommand
    > = new Discord.Collection(),
    public aliases: Discord.Collection<
      string,
      unknown
    > = new Discord.Collection(),
    public events: Discord.Collection<
      string,
      BaseEvent
    > = new Discord.Collection(),
    public translations: Map<string, TFunction> = new Map()
  ) {
    this.commands = commands;
    this.aliases = aliases;
    this.events = events;
  }
}

export const InviteURL: string =
  "https://discord.com/api/oauth2/authorize?client_id=708822043420000366&permissions=8&scope=bot%20applications.commands";
