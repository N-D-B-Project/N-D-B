import { Config } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { parse } from "path";
import { BaseSlashCommand } from "../Structures";
import BaseHandler from "./BaseHandler";

export default class SlashHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async load() {
    this.client.Collections.SlashCommands.clear();
    const baseHandler = new BaseHandler(this.client);

    const commandFiles = await baseHandler.getFiles("Commands/Slash");
    commandFiles.forEach(async commandFile => {
      const { name } = parse(commandFile);
      const File = await baseHandler.findClass(await import(commandFile));
      if (!File) {
        throw new TypeError(`Comando: ${name} não exportou uma Class`);
      }

      const command = new File(this.client, name.toLowerCase());
      if (!(command instanceof BaseSlashCommand)) {
        throw new TypeError(`Comando: ${name} não esta em Commands/Message`);
      }
      if (command.options.data) {
        try {
          this.client.Collections.SlashCommands.set(
            command.options.data.name,
            command
          );

          // GuildOnly
          if (command.options.deployMode === "Guild") {
            await this.client.guilds.cache
              .get(Config.NDCommunity.ID)
              ?.commands.create(command.options.data)
              .then(res => {
                return res;
              });
          }

          // InDevCommands
          if (command.options.deployMode === "Test") {
            await this.client.guilds.cache
              .get(Config.TestGuild.ID)
              ?.commands.create(command.options.data)
              .then(res => {
                return res;
              });
          }

          // Global
          if (command.options.deployMode === "Global") {
            await this.client.application?.commands
              .create(command.options.data)
              .then(res => {
                return res;
              });
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
}
