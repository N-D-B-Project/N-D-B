import NDBClient from "@Client/NDBClient";
import { BaseSlashCommand } from "@Utils/Structures";
import { Config } from "~/Config/Config";
import { HandlerTools } from ".";
import { parse } from "path";
import { readdirSync } from "fs";

export default class SlashHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public async load() {
    const Tools = new HandlerTools();
    try {
      readdirSync(`${Tools.directory}Commands/Slash/`).forEach(
        async (dir: string) => {
          var commandDir: string[];
          switch (process.env.isCompiled) {
            case "true":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Slash/${dir}`
              ).filter((file) => file.endsWith(".js"));
              break;
            case "false":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Slash/${dir}`
              ).filter((file) => file.endsWith(".ts"));
              break;
          }

          for (const commandFile of commandDir) {
            delete require.cache[commandFile];
            const { name } = parse(commandFile);
            const File = Tools.findClass(
              require(`${Tools.directory}Commands/Slash/${dir}/${commandFile}`)
            );
            if (!File) {
              throw new TypeError(
                `Comando: \`${name}\` Não Exportou uma Class`
              );
            }
            const command = new File(this.client, name.toLowerCase());
            if (!(command instanceof BaseSlashCommand)) {
              throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
            }

            if (command.options.data) {
              try {
                this.client.Collections.SlashCommands.set(
                  command.options.data.name,
                  command
                );
                // const slashCommand = await this.client.application?.commands //! Global
                const slashCommand = await this.client.guilds.cache
                  .get(Config.NDCommunity.ID)
                  ?.commands.create(command.options.data)
                  // ?.commands.set([]) // Delete
                  .then((res) => {
                    this.client.logger.command(`(/) Slash Commands Registered`);
                    // console.log(res);
                    return res;
                  });

                //# Delete SlashCommands
                // const deleteCommand = await this.client.application?.commands.delete("") //! Global
                // const deleteCommand = await this.client.guilds.cache.get("")?.commands.delete("").then(console.log).catch(console.error) //! GuildOnly
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      );
    } catch (error) {
      this.client.logger.error("SlashCommandHandler ", error);
    }
  }
}
