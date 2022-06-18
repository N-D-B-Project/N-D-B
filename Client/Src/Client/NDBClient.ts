import {
  Client,
  Message,
  CommandInteraction,
  GuildChannel,
  PartialMessage,
  ActivityType,
  Presence,
} from "discord.js";
import ErelaManager from "./ErelaManager";
import { _ClientOptions, Collections, Config } from "~/Config";
import {
  EventHandler,
  CommandHandler,
  SlashHandler,
  LanguageHandler,
} from "@Utils/Handlers";
import { Logger, Tools, Mongoose } from "@Utils/Tools";
import StartApps from "~/APIs/Apps/StartApps";

export default class NDBClient extends Client {
  public ReadyState: boolean = false;
  public Config: typeof Config = Config;
  public Collections: Collections = new Collections();
  public ErelaManager: ErelaManager = new ErelaManager(this);
  private EventHandler: EventHandler = new EventHandler(this);
  private CommandHandler: CommandHandler = new CommandHandler(this);
  private SlashHandler: SlashHandler = new SlashHandler(this);
  private readonly StartApps: StartApps = new StartApps(this);
  public readonly logger: Logger = new Logger();
  public readonly Tools: Tools = new Tools(this);
  public readonly Mongoose: Mongoose = new Mongoose(this);

  public constructor() {
    super(_ClientOptions);
  }

  public async Start(): Promise<void> {
    await this.CommandHandler.loadCommands();
    await this.EventHandler.loadEvents();
    // ! For some reason the SlashCommands Handler doesn't work if it's not inside ReadyEvent
    this.once("ready", async () => {
      await this.SlashHandler.loadSlashCommands();
    });
    this.Collections.translations = await LanguageHandler();
    await this.Mongoose.start();
    await this.StartApps.InitAll();
    var Token: string;
    switch (process.env.NODE_ENV) {
      case "Development":
        Token = process.env.DevToken;
        break;
      case "Production":
        Token = process.env.Token;
        break;
    }
    await this.login(Token).catch((error: Error) => {
      this.logger.error(
        `Não foi possível se conectar a Gateway do Discord devido ao Erro: ${error}`
      );
    });
  }

  public async translate(
    key: string,
    info: Message | CommandInteraction | GuildChannel | PartialMessage,
    args?: Record<string, unknown>
  ): Promise<any> {
    const find = await this.Mongoose.FindGuildConfig(info.guild);
    let locale = find.get("Settings.Language");
    if (!locale) locale = "pt-BR";
    const language = this.Collections.translations.get(locale);
    if (!language) throw "Linguagem invalida || Key não encontrada";
    return language(key, args);
  }

  public async setShardPresence(
    type: ActivityType,
    name: string,
    url: string
  ): Promise<Presence> {
    return this.user?.setPresence({
      activities: [
        {
          // TODO: js won't accept all ActivityType's here
          // Need to find a solution to remove "any"
          type: type as any,
          name,
          url,
        },
      ],
    });
  }
}
