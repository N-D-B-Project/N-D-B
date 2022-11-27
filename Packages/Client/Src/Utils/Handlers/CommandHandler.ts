import NDBClient from "@Client/NDBClient";
import { BaseCommand } from "@Utils/Structures";
import { HandlerTools } from ".";
import { parse } from "path";
import { readdirSync } from "fs";
export default class CommandHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public async load() {
    const Tools = new HandlerTools();
    try {
      readdirSync(`${Tools.directory}Commands/Message/`).forEach(
        async (dir: string) => {
          var commandDir: string[];
          switch (process.env.isCompiled) {
            case "true":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Message/${dir}`
              ).filter((file) => file.endsWith(".js"));
              break;
            case "false":
              commandDir = readdirSync(
                `${Tools.directory}Commands/Message/${dir}`
              ).filter((file) => file.endsWith(".ts"));
              break;
          }
          console.log(commandDir);
          for (const commandFile of commandDir) {
            delete require.cache[commandFile];
            const { name } = parse(commandFile);
            const File = Tools.findClass(
              require(`${Tools.directory}Commands/Message/${dir}/${commandFile}`)
            );
            if (!File) {
              throw new TypeError(
                `Comando: \`${name}\` Não Exportou uma Class`
              );
            }
            const command = new File(this.client, name.toLowerCase());
            if (!(command instanceof BaseCommand)) {
              throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
            }
            this.client.Collections.commands.set(command.options.name, command);
            if (command.options.aliases.length) {
              for (const alias of command.options.aliases) {
                this.client.Collections.aliases.set(
                  alias,
                  command.options.name
                );
              }
            }
          }
        }
      );
    } catch (error) {
      this.client.logger.error("CommandHandler ", error);
    }
  }
}
