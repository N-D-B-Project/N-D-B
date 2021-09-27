import NDBClient from "@/Client/Client";
import { BaseCommand } from "@Structures/BaseCommand";
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export class SlashHandler {
  private client: NDBClient;

  constructor(client) {
    this.client = client;
  }

  isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async loadSlashCommands() {
    return globProm(`${this.directory}Commands/**/*.ts`).then(
      async (commands: any[]) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];
          const { name } = path.parse(commandFile);
          const File = require(commandFile);
          if (!this.isClass(File))
            throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
          const command = new File(this.client, name.toLowerCase());
          if (!(command instanceof BaseCommand))
            throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);

          if (command.options.SlashOptions) {
            try {
              // const slashcommand = await this.client.application?.commands //! Global
              const slashcommand = await this.client.guilds.cache
                .get("717094267243462688")
                ?.commands.create(command.options.SlashOptions)
                .then((res) => {
                  if (this.client.Config.Debug.SlashCommands === true) console.log(res);
                  return res;
                });

              //# Delete SlashCommands
              // const deleteCommand = await this.client.application?.commands.delete("") //! Global
              // const deleteCommand = await this.client.guilds.cache.get("717094267243462688")?.commands.delete("") //! GuildOnly
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    );
  }
}
