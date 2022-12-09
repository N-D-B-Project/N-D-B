import { Client } from "discord.js";
import { _ClientOptions, Collections } from "~/Config/ClientUtils";
import { LanguageHandler, Translate, HandlerClass } from "@Utils/Handlers";
import { Logger, Database, Tools } from "@Utils/Tools";

export default class NDBClient extends Client {
  public Collections: Collections = new Collections();
  public Tools: Tools = new Tools(this);
  public Translate: Translate = new Translate(this);

  private readonly HandlerClass = new HandlerClass(this);
  public readonly logger: Logger = new Logger();
  public readonly Database: Database = new Database(this);

  public constructor() {
    super(_ClientOptions);
  }

  public async Start(): Promise<void> {
    this.Collections.translations = await LanguageHandler();
    await this.Database.Load();
    await this.HandlerClass.Load();

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
}
