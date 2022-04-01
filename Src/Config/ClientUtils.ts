import * as Discord from "discord.js";
import { TFunction } from "i18next";
import BaseEvent from "@Structures/BaseEvent";
import BaseCommand from "@Structures/BaseCommand";
import { ColorsType, EmojisType, URLListType } from "~/Types";

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
      string
    > = new Discord.Collection(),
    public SlashCommands: Discord.Collection<
      string,
      BaseCommand
    > = new Discord.Collection(),
    public events: Discord.Collection<
      string,
      BaseEvent
    > = new Discord.Collection(),
    public translations: Map<string, TFunction> = new Map()
  ) {
    this.commands = commands;
    this.aliases = aliases;
    this.SlashCommands = SlashCommands;
    this.events = events;
  }
}

export const InviteURL: string =
  "https://discord.com/api/oauth2/authorize?client_id=708822043420000366&permissions=8&scope=bot%20applications.commands";

export const Colors: ColorsType = {
  Client: {
    Green: "#00c26f",
    Red: "#c20e00"
  }
}

export const Emojis: EmojisType = {
  fail: "<:NotixDeny:719560576015138830>",
  success: "<:NotixAllow:719560623960096789>",
  thing: "<a:OPensador:718195925327151134>",
  loading: "<a:Carregando:718196232757182566>",
  loading2: "<a:Carregando2:718196278646800424>",
  delayping: "<:DelayPing:718196166399098901>",
  Music: {
    Youtube: "<:youtube:730741995416453150>",
    Spotify: "<:Spotify:775154334832001044>",
    SoundCloud: "<:soundcloud:932065538014842950>",
    Deezer: "<:deezer:932065971336802334>",
    Facebook: "<:facebook:932066080996864070>",
    Apple: "<:Apple:852677662983716884>"
  }
}

export const URLList: URLListType = {
  Music: {
      Youtube: "https://www.youtube.com",
      ShortYoutube: "https://youtu.be",
      SoundCloud: "https://soundcloud.com",
      Spotify: "https://open.spotify.com",
      Deezer: "https://www.deezer",
      Facebook: "https://facebook.com",
      Apple: "https://music.apple.com/"
  }
}

