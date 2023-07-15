import NDBClient from "@/Core/NDBClient";
import { parse } from "path";
import { BaseSubCommand } from "../Structures";
import BaseHandler from "./BaseHandler";

export default class SubHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async load() {
    this.client.Collections.SubCommands.clear();
    const baseHandler = new BaseHandler(this.client);

    const commandFiles = await baseHandler.getFiles("Commands/Sub");
    commandFiles.forEach(async commandFile => {
      const { name } = parse(commandFile);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const File = await baseHandler.findClass(require(commandFile));
      if (!File) {
        throw new TypeError(`Comando: ${name} não exportou uma Class`);
      }

      const command = new File(this.client, name.toLowerCase());
      if (!(command instanceof BaseSubCommand)) {
        throw new TypeError(`Comando: ${name} não esta em Commands/Message`);
      }
      this.client.Collections.SubCommands.set(
        command.options.name + command.options.category,
        command
      );
    });
  }
}
