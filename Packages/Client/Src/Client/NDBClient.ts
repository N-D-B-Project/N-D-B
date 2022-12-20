import { Collections, _ClientOptions } from "@/Config/ClientUtils"
import { HandlerClass, LanguageHandler, Translate } from "@/Utils//Handlers"
import { Logger, Tools } from "@/Utils/Tools"
import { Client } from "discord.js"
export default class NDBClient extends Client {
  public Collections: Collections = new Collections()
  public Tools: Tools = new Tools(this)
  public Translate: Translate = new Translate(this)

  private readonly HandlerClass = new HandlerClass(this)
  public readonly logger: Logger = new Logger()

  public constructor() {
    super(_ClientOptions)
  }

  public async Start(): Promise<void> {
    this.Collections.translations = await LanguageHandler()
    await this.HandlerClass.Load()

    var Token: string
    switch (process.env.NODE_ENV) {
      case "Development":
        Token = process.env.DevToken
        break
      case "Production":
        Token = process.env.Token
        break
    }
    await this.login(Token).catch((error: Error) => {
      this.logger.error(
        `Não foi possível se conectar a Gateway do Discord devido ao Erro: ${error}`
      )
    })
  }
}
