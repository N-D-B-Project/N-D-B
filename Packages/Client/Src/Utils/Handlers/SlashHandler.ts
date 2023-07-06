import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import { parse } from "path"
import { BaseSlashCommand } from "../Structures"
import BaseHandler from "./BaseHandler"

export default class SlashHandler {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  async load() {
    this.client.Collections.SlashCommands.clear()
    const baseHandler = new BaseHandler(this.client)

    const commandFiles = await baseHandler.getFiles("Commands/Slash")
    commandFiles.forEach(async commandFile => {
      const { name } = parse(commandFile)
      const File = await baseHandler.findClass(require(commandFile))
      if (!File) {
        throw new TypeError(`Comando: ${name} não exportou uma Class`)
      }

      const command = new File(this.client, name.toLowerCase())
      if (!(command instanceof BaseSlashCommand)) {
        throw new TypeError(`Comando: ${name} não esta em Commands/Message`)
      }
      if (command.options.data) {
        try {
          this.client.Collections.SlashCommands.set(
            command.options.data.name,
            command
          )

          // GuildOnly
          if (command.options.deployMode === "Guild") {
            const slashCommandGuild = await this.client.guilds.cache
              .get(Config.NDCommunity.ID)
              ?.commands.create(command.options.data)
              .then(res => {
                this.client.logger.command(
                  `(/) Slash Commands Registered [Guild], ${res.name}`
                )
                return res
              })
          }

          // InDevCommands
          if (command.options.deployMode === "Test") {
            const slashCommandTest = await this.client.guilds.cache
              .get(Config.TestGuild.ID)
              ?.commands.create(command.options.data)
              .then(res => {
                this.client.logger.command(
                  `(/) Slash Commands Registered [Test], ${res.name}`
                )
                return res
              })
          }

          // Global
          if (command.options.deployMode === "Global") {
            const slashCommandGlobal = await this.client.application?.commands
              .create(command.options.data)
              .then(res => {
                this.client.logger.command(
                  `(/) Slash Commands Registered [Global], ${res.name}`
                )
                return res
              })
          }
        } catch (e) {
          console.log(e)
        }
      }
    })
  }
}
