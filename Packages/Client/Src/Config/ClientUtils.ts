/* eslint-disable no-empty-function */
import { BaseCommand, BaseEvent } from "@/Utils/Structures";
import { GatewayIntentBits, GatewayVersion } from "discord-api-types/v10";
import { ClientOptions, Collection, Options, Partials } from "discord.js";
import { TFunction } from "i18next";

export const _ClientOptions: ClientOptions = {
  shards: "auto",
  rest: {
    version: GatewayVersion,
    offset: 0,
    api: "https://discord.com/api/",
    cdn: "https://cdn.discordapp.com"
  },
  failIfNotExists: true,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false
  },
  makeCache: Options.cacheEverything(),
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User
  ],
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
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
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ]
};

export class Collections {
  public constructor(
    public Commands: Collection<string, BaseCommand> = new Collection(),
    public aliases: Collection<string, string> = new Collection(),
    public SlashCommands: Collection<string, BaseCommand> = new Collection(),
    public SubCommands: Collection<string, BaseCommand> = new Collection(),
    public events: Collection<string, BaseEvent> = new Collection(),
    public translations: Map<string, TFunction> = new Map(),
    public languages = import("../Utils/Languages/i18next/language-meta.json")
  ) {}
}
