import { Config } from "@/Config/Config";
import { CommandOptions as cmdOptions, INDBClient } from "@/Types";
import { parse } from "path";
import { BaseHandler } from ".";
import { BaseCommand } from "../Structures";

export default class CommandHandler {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}

  async load() {
    this.client.Collections.Commands.clear();
    const baseHandler = new BaseHandler();

    const commandFiles = await baseHandler.getFiles("Commands");
    commandFiles.forEach(async commandFile => {
      const { name } = parse(commandFile);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const File = await baseHandler.findClass(await import(commandFile));
      if (!File) {
        throw new TypeError(`Comando: ${name} não exportou uma Class`);
      }

      const command = new File(this.client, name);
      const CommandOptions = command.options as cmdOptions;
      if (!(command instanceof BaseCommand)) {
        throw new TypeError(`Comando: ${name} não esta em Commands`);
      }
      if (CommandOptions.name !== "_Category") {
        this.client.Collections.Commands.set(CommandOptions.name, command);
        if (CommandOptions.aliases) {
          for (const alias of CommandOptions.aliases) {
            this.client.Collections.aliases.set(alias, CommandOptions.name);
          }
        }
      }

      // Slash Commands
      const SlashData = CommandOptions.slash;
      if (SlashData && SlashData.type === "Main") {
        try {
          this.client.Collections.SlashCommands.set(
            SlashData.data.name,
            command
          );

          // GuildOnly
          if (CommandOptions.slash.deployMode === "Guild") {
            await this.client.guilds.cache
              .get(Config.NDCommunity.ID)
              ?.commands.create(SlashData.data)
              .then(res => {
                return res;
              });
          }

          // InDevCommands
          if (CommandOptions.slash.deployMode === "Test") {
            await this.client.guilds.cache
              .get(Config.TestGuild.ID)
              ?.commands.create(SlashData.data)
              .then(res => {
                return res;
              });
          }

          // Global
          if (SlashData.deployMode === "Global") {
            await this.client.application?.commands
              .create(SlashData.data)
              .then(res => {
                return res;
              });
          }
        } catch (e) {
          console.log(e);
        }
      }

      // Slash Sub Commands
      if (SlashData?.type === "Sub") {
        if (!SlashData.name) throw new Error("SubCommand don't have a name");
        this.client.Collections.SubCommands.set(SlashData.name, command);
      }
    });
  }
}
