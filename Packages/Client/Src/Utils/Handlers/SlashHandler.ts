import NDBClient from "@Client/NDBClient"
import { BaseSlashCommand } from "@Utils/Structures"
import { readdirSync } from "fs"
import { parse } from "path"
import { Config } from "~/Config/Config"
import { HandlerTools } from "."

export default class SlashHandler {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  public async load() {
    const Tools = new HandlerTools()
    try {
      readdirSync(`${Tools.directory}Commands/Slash/`).forEach(
        async (dir: string) => {
          var commandDir: string[]
          switch (process.env.isCompiled) {
            case "true":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Slash/${dir}`
              ).filter(file => file.endsWith(".js"))
              break
            case "false":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Slash/${dir}`
              ).filter(file => file.endsWith(".ts"))
              break
          }

          for (const commandFile of commandDir) {
            delete require.cache[commandFile]
            const { name } = parse(commandFile)
            const File = Tools.findClass(
              require(`${Tools.directory}Commands/Slash/${dir}/${commandFile}`)
            )
            if (!File) {
              throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`)
            }
            const command = new File(this.client, name.toLowerCase())
            if (!(command instanceof BaseSlashCommand)) {
              throw new TypeError(`Comando: \`${name}\` Não está em Commands`)
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
                        `(/) Slash Commands Registered`
                      )
                      return res
                    })
                }
                if (command.options.deployMode === "Global") {
                  const slashCommandGlobal =
                    await this.client.application?.commands.create(
                      command.options.data
                    )
                }

                // InDevCommands
                if (command.options.deployMode === "Test") {
                  const slashCommandTest = await this.client.guilds.cache
                    .get(Config.TestGuild.ID)
                    ?.commands.create(command.options.data)
                    .then(res => {
                      this.client.logger.command(
                        `(/) Slash Commands Registered`
                      )
                      return res
                    })
                }
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      )
    } catch (error) {
      this.client.logger.error("SlashCommandHandler ", error)
    }
  }
}
