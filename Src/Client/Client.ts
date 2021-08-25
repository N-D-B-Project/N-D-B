import * as Discord from "discord.js";
import * as DiscordTogether from "discord-together"
import { TFunction } from "i18next";
// import consola, { Consola } from "consola";

import { BaseCommand } from "@Structures/BaseCommand";
import { BaseEvent } from "@Structures/BaseEvent";
import { CommandHandler } from "@Handlers/CommandHandler";
import { EventHandler } from "@Handlers/EventHandler";
import { SlashHandler } from "@Handlers/SlashHandler";
import LanguageHandler from "@Handlers/LanguageHandler";

import * as Config from "@Config/Config";
import Logger from "@Tools/Logger";
import Tools from "@Tools/Tools";
import MongoDB from "@Tools/Mongoose";
import ExpressApps from "@/Express/ExpressApps";

export default class NDBClient extends Discord.Client {
  //$ Collections
  public commands: Discord.Collection<unknown, BaseCommand> =
    new Discord.Collection();
  public aliases: Discord.Collection<unknown, unknown> =
    new Discord.Collection();
  public events: Discord.Collection<string, BaseEvent> =
    new Discord.Collection();
  public tranlations: Map<string, TFunction> = new Map();
  public snipe: Map<any, any> = new Map();
  public editSnipe: Map<any, any> = new Map();

  //! Configs
  // public logger: Consola = consola;
  public logger: Logger = new Logger();
  public config: any//Config;
  public owners: Array<string>;
  public Tools: Tools;
  public MongoDB: MongoDB;
  public together: any
  public ExpressApps: ExpressApps;

  //# Handlers
  public CommandHandler: CommandHandler;
  public EventHandler: EventHandler;
  public SlashHandler: SlashHandler;

  public constructor() {
    super({
      messageCacheLifetime: 10000,
      restTimeOffset: 0,
      shards: "auto",
      restWsBridgeTimeout: 100,
      allowedMentions: { parse: ["users", "roles"] },
      partials: [
        "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"
      ],
      intents: /* 32767 */[
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
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
    });

    this.CommandHandler = new CommandHandler(this);
    this.SlashHandler = new SlashHandler(this);
    this.EventHandler = new EventHandler(this);

    this.Tools = new Tools(this);
    this.config = Config;
    this.MongoDB = new MongoDB(this);
    this.together = new DiscordTogether.DiscordTogether(this)

    this.snipe = new Map();
    this.editSnipe = new Map();

    this.ExpressApps = new ExpressApps(this);
  }

  public async start(): Promise<any> {
    switch (process.env.NODE_ENV) {
      case "Development":
        var Token = process.env.DevToken;
        break;
      case "Production":
        var Token = process.env.Token;
        break;
    }

    //! For some reason the SlashCommands Handler doesn't work if it's not inside ReadyEvent
    await await this.CommandHandler.loadCommands();
    await this.EventHandler.loadEvents();

    await this.ExpressApps.InitAll()
    this.MongoDB.init();
    //! CreateOnStart (GuildConfigs) in ReadyEvent

    this.tranlations = await LanguageHandler();

    try {
      super.login(Token);
    } catch (error) {
      this.logger.error("Não foi possível se conectar a Gateway do Discord devido ao Erro: " + error);
    }
  }

  public async translate(
    key: string,
    message,
    args?: Record<string, unknown>
  ): Promise<any> {
    const find = await this.MongoDB.FindGuildConfig(message.guild);
    var locale = find.get("Settings.Language");
    if (!locale) locale = "pt-BR";
    const language = this.tranlations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }
}
