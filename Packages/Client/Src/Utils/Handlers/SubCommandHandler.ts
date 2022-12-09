import NDBClient from "@Client/NDBClient";
import { BaseSubCommand } from "@Utils/Structures";
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
      readdirSync(`${Tools.directory}Commands/Sub/`).forEach(
        async (dir: string) => {
          var commandDir: string[];
          switch (process.env.isCompiled) {
            case "true":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Sub/${dir}`
              ).filter((file) => file.endsWith(".js"));
              break;
            case "false":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Sub/${dir}`
              ).filter((file) => file.endsWith(".ts"));
              break;
          }
          for (const commandFile of commandDir) {
            delete require.cache[commandFile];
            const { name } = parse(commandFile);

            //! Não carrega depois daqui...

            const File = Tools.findClass(
              require(`${Tools.directory}Commands/Sub/${dir}/${commandFile}`)
            );
            if (!File) {
              throw new TypeError(
                `Comando: \`${name}\` Não Exportou uma Class`
              );
            }
            const command = new File(this.client, name.toLowerCase());
            if (!(command instanceof BaseSubCommand)) {
              throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
            }
            this.client.Collections.SubCommands.set(
              command.options.name + command.options.category,
              command
            );
          }
        }
      );
    } catch (error) {
      this.client.logger.error("SubCommandHandler ", error);
    }
  }
}
