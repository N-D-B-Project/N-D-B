import { INDBClient } from "@/Types";
import { parse } from "path";
import { BaseCommand } from "../Structures";
import BaseHandler from "./BaseHandler";

export default class CommandHandler {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}

  async load() {
    this.client.Collections.commands.clear();
    const baseHandler = new BaseHandler();

    const commandFiles = await baseHandler.getFiles("Commands/Message");
    commandFiles.forEach(async commandFile => {
      const { name } = parse(commandFile);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const File = await baseHandler.findClass(await import(commandFile));
      if (!File) {
        throw new TypeError(`Comando: ${name} não exportou uma Class`);
      }

      const command = new File(this.client, name);
      if (!(command instanceof BaseCommand)) {
        throw new TypeError(`Comando: ${name} não esta em Commands/Message`);
      }
      this.client.Collections.commands.set(command.options.name, command);
      if (command.options.aliases) {
        for (const alias of command.options.aliases) {
          this.client.Collections.aliases.set(alias, command.options.name);
        }
      }
    });
  }
}
