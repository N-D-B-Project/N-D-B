import NDBClient from "@Client/NDBClient";
import BaseCommand from "@Structures/BaseCommand";
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export default class CommandHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  private isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  private get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  public async loadCommands() {
    var FilePath: string;
    switch (process.env.isCompiled) {
      case "false":
        FilePath = `Commands/**/*.ts`;
        break;
      case "true":
        FilePath = `Commands/**/*.js`;
        break;
    }
    return globProm(`${this.directory}${FilePath}`).then((commands: any[]) => {
      for (const commandFile of commands) {
        delete require.cache[commandFile];
        const { name } = path.parse(commandFile);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const File = require(commandFile);
        if (!this.isClass(File)) {
          throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
        }
        const command = new File(this.client, name.toLowerCase());
        if (!(command instanceof BaseCommand)) {
          throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
        }
        this.client.Collections.commands.set(command.name, command);
        if (command.options.aliases.length) {
          for (const alias of command.options.aliases) {
            this.client.Collections.aliases.set(alias, command.name);
          }
        }
      }
    });
  }
}
