import { Collections, _ClientOptions } from "@/Config/ClientUtils";
import PrismaProvider from "@/Database/Prisma.provider";
import { LanguageHandler, LoadHandlers, Translate } from "@/Utils/Handlers";
import { Logger, Tools } from "@/Utils/Tools";
import { Client } from "discord.js";
import MusicManager from "./MusicManager";

export default class NDBClient extends Client {
  public database: PrismaProvider = new PrismaProvider(this);
  public Collections: Collections = new Collections();
  public Tools: Tools = new Tools(this);
  public Translate: Translate = new Translate(this);
  public MusicManager: MusicManager = new MusicManager(this);

  private readonly LoadHandlers = new LoadHandlers(this);
  public readonly logger: Logger = new Logger();

  public constructor() {
    super(_ClientOptions);
  }

  public async Start(): Promise<void> {
    this.Collections.translations = await LanguageHandler(this.logger);
    await this.LoadHandlers.load();
    this.database.Connect();
    let Token: string;
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
      this.database.Disconnect(
        "Error when login Bot Client into Discord Gateway"
      );
    });
  }
}
