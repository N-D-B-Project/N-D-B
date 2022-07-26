import NDBClient from "@Client/NDBClient";
import { BaseCommand } from "@Utils/Structures";
import { Config } from "~/Config/Config";
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export default class SlashHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  private isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  private findClass(module: any) {
    if (module.__esModule) {
      const def = Reflect.get(module, "default");
      if (this.isClass(def)) {
        return def;
      }

      let _class = null;
      for (const prop of Object.keys(module)) {
        const ref = Reflect.get(module, prop);
        if (this.isClass(ref)) {
          _class = ref;
          break;
        }
      }

      return _class;
    }

    return this.isClass(module) ? module : null;
  }

  private get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  public async loadSlashCommands() {
    var FilePath: string;
    switch (process.env.isCompiled) {
      case "false":
        FilePath = `Commands/**/*.ts`;
        break;
      case "true":
        FilePath = `Commands/**/*.js`;
        break;
    }
    return globProm(`${this.directory}${FilePath}`).then(
      async (commands: any[]) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];
          const { name } = path.parse(commandFile);
          const File = this.findClass(require(commandFile));
          if (!File) {
            throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
          }
          const command = new File(this.client, name.toLowerCase());
          if (!(command instanceof BaseCommand)) {
            throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
          }

          if (command.options.SlashOptions) {
            try {
              this.client.Collections.SlashCommands.set(
                command.options.name,
                command
              );
              // const slashcommand = await this.client.application?.commands //! Global
              const slashcommand = await this.client.guilds.cache
                // .get(Config.TestGuilds.ID[0])
                .get("679066351456878633")
                ?.commands.create(command.options.SlashOptions)
                .then((res) => {
                  if (Config.Debug.SlashCommands) {
                    console.log(`(/) Command Name: ${res.name}, Id: ${res.id}`);
                  }
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
  }
}
