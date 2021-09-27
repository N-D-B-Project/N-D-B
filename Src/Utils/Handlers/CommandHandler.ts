import NDBClient from "@/Client/Client";
import { BaseCommand } from "@Structures/BaseCommand";
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export class CommandHandler {
  private client: NDBClient;

  constructor(client: NDBClient) {
    this.client = client;
  }

  isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async loadCommands() {
    return globProm(`${this.directory}Commands/**/*.ts`).then(
      (commands: any[]) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];
          const { name } = path.parse(commandFile);
          const File = require(commandFile);
          if (!this.isClass(File))
            throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
          const command = new File(this.client, name.toLowerCase());
          if (!(command instanceof BaseCommand))
            throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
          this.client.collections.commands.set(command.options.name, command);
          if (command.options.aliases.length) {
            for (const alias of command.options.aliases) {
              this.client.collections.aliases.set(alias, command.options.name);
            }
          }
        }
      }
    );
  }
}
