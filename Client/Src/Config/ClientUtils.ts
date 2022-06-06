import {
  ClientOptions,
  GatewayIntentBits,
  Partials,
  Options,
  Collection,
} from "discord.js";
import { TFunction } from "i18next";
import BaseEvent from "@Structures/BaseEvent";
import BaseCommand from "@Structures/BaseCommand";
import { ColorsType, EmojisType, URLListType } from "~/Types";

export const _ClientOptions: ClientOptions = {
  shards: "auto",
  failIfNotExists: false,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    MessageManager: {
      maxSize: 2,
    },
    ThreadManager: {
      maxSize: 2,
    },
    ThreadMemberManager: {
      maxSize: 2,
    },
  }),
};

export class Collections {
  public constructor(
    public commands: Collection<string, BaseCommand> = new Collection(),
    public aliases: Collection<string, string> = new Collection(),
    public SlashCommands: Collection<string, BaseCommand> = new Collection(),
    public events: Collection<string, BaseEvent> = new Collection(),
    public translations: Map<string, TFunction> = new Map(),
    public languages: any = import("../Utils/Languages/language-meta.json"),
    public react: Map<any, any> = new Map()
  ) {
    this.commands = commands;
    this.aliases = aliases;
    this.SlashCommands = SlashCommands;
    this.events = events;
  }
}

export const InviteURL: string =
  "https://com/api/oauth2/authorize?client_id=708822043420000366&permissions=8&scope=bot%20applications.commands";

export const Colors: ColorsType = {
  Client: {
    Green: "#00c26f",
    Red: "#c20e00",
  },
};

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
    Apple: "<:Apple:852677662983716884>",
  },
};

export const URLList: URLListType = {
  Music: {
    Youtube: "https://www.youtube.com",
    ShortYoutube: "https://youtu.be",
    SoundCloud: "https://soundcloud.com",
    Spotify: "https://open.spotify.com",
    Deezer: "https://www.deezer",
    Facebook: "https://facebook.com",
    Apple: "https://music.apple.com/",
  },
};
