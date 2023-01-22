import {
  BaseCommand,
  BaseEvent,
  BaseSlashCommand,
  BaseSubCommand
} from "@/Utils/Structures"
import { GatewayIntentBits, GatewayVersion } from "discord-api-types/v10"
import { ClientOptions, Collection, Partials } from "discord.js"
import { TFunction } from "i18next"

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
    GatewayIntentBits.MessageContent
  ]
}

export class Collections {
  public constructor(
    public commands: Collection<string, BaseCommand> = new Collection(),
    public aliases: Collection<string, string> = new Collection(),
    public SlashCommands: Collection<
      string,
      BaseSlashCommand
    > = new Collection(),
    public SubCommands: Collection<string, BaseSubCommand> = new Collection(),
    public events: Collection<string, BaseEvent> = new Collection(),
    public translations: Map<string, TFunction> = new Map(),
    public languages: any = import("../Utils/Languages/language-meta.json"),
    public react: Map<any, any> = new Map()
  ) {}
}
