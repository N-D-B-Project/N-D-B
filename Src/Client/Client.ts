//# Packages
import * as Discord from "discord.js";
import { DiscordTogether } from "discord-together"

//! Handlers
import { CommandHandler } from "@Handlers/CommandHandler";
import { EventHandler } from "@Handlers/EventHandler";
import { SlashHandler } from "@Handlers/SlashHandler";
import LanguageHandler from "@Handlers/LanguageHandler";

//$ Configs
import { ClientConfig } from "@/Config/ClientOptions";
import { Config } from "@Config/Config"
import Collections from "@Config/Collections";

//% Tools
import Logger from "@Tools/Logger";
import Tools from "@Tools/Tools";
import MongoDB from "@Tools/Mongoose";
import ExpressApps from "@/Express/ExpressApps";

export default class NDBClient extends Discord.Client {
  //# Handlers
  private CommandHandler: CommandHandler;
  private EventHandler: EventHandler;
  public SlashHandler: SlashHandler;

  //$ Configs
  public logger: Logger = new Logger();
  public Config: Config;
  public owners: Array<string>;
  public Tools: Tools;
  public MongoDB: MongoDB;
  public together: any;
  private ExpressApps: ExpressApps;
  public collections: Collections;

  public constructor() {
    super(ClientConfig);

    //! Handlers
    this.CommandHandler = new CommandHandler(this);
    this.SlashHandler = new SlashHandler(this);
    this.EventHandler = new EventHandler(this);

    //% Tools
    this.Config = Config;
    this.Tools = new Tools(this);
    this.MongoDB = new MongoDB(this);
    this.collections = new Collections(this);
    this.together = new DiscordTogether(this);
    this.ExpressApps = new ExpressApps(this);
  }

  public async start(): Promise<any> {
    //! For some reason the SlashCommands Handler doesn't work if it's not inside ReadyEvent
    await this.CommandHandler.loadCommands();
    await this.EventHandler.loadEvents();

    await this.ExpressApps.InitAll()
    this.MongoDB.init();
    //! CreateOnStart (GuildConfigs) in ReadyEvent

    this.collections.tranlations = await LanguageHandler();

    try {
      switch (process.env.NODE_ENV) {
        case "Development":
          var Token = process.env.DevToken;
          break;
        case "Production":
          var Token = process.env.Token;
          break;
      }
      super.login(Token);
    } catch (error) {
      this.logger.error("Não foi possível se conectar a Gateway do Discord devido ao Erro: " + error);
    }
  }

  public async translate(
    key: string,
    message: Discord.Message | Discord.CommandInteraction,
    args?: Record<string, unknown>
  ): Promise<any> {
    const find = await this.MongoDB.FindGuildConfig(message.guild);
    var locale = find.get("Settings.Language");
    if (!locale) locale = "pt-BR";
    const language = this.collections.tranlations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }
}
