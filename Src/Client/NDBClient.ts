import * as Discord from "discord.js";
import { ClientOptions, Collections, Config } from "~/Config";
import { EventHandler, CommandHandler, SlashHandler } from "@Utils/Handlers";
import { Logger, Tools, Mongoose } from "@Utils/Tools";
import StartApps from "~/APIs/Apps/StartApps";

export default class NDBClient extends Discord.Client {
  public ReadyState: boolean = false;
  public Config: typeof Config = Config;
  public Collections: Collections = new Collections();
  private EventHandler: EventHandler = new EventHandler(this);
  private CommandHandler: CommandHandler = new CommandHandler(this);
  private SlashHandler: SlashHandler = new SlashHandler(this);
  private readonly StartApps: StartApps = new StartApps(this);
  public readonly logger: Logger = new Logger();
  public readonly Tools: Tools = new Tools(this);
  public readonly Mongoose: Mongoose = new Mongoose(this);

  public constructor() {
    super(ClientOptions);
  }

  public async Start(): Promise<void> {
    await this.CommandHandler.loadCommands();
    await this.EventHandler.loadEvents();
    // ! For some reason the SlashCommands Handler doesn't work if it's not inside ReadyEvent
    this.once("ready", async () => {
      await this.SlashHandler.loadSlashCommands();
    });
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
    info: Discord.Message | Discord.CommandInteraction | Discord.GuildChannel,
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
    type: Discord.ActivityType,
    name: string,
    url: string
  ): Promise<Discord.Presence> {
    return this.user?.setPresence({
      activities: [
        {
          // TODO: Discord.js won't accept all ActivityType's here
          // Need to find a solution to remove "any"
          type: type as any,
          name,
          url,
        },
      ],
    });
  }
}
