const BaseEvent = require("../../utils/structures/BaseEvent");
const GuildConfig = require("../../database/schemas/GuildConfig");
const Config = require("../../../Config/Config.json");
module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message, guild) {
    if (message.author.bot) return;

    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });
    if(!guildConfig) {
      await new GuildConfig({
        guildName: message.guild.name,
        guildId: message.guild.id,
        prefix: "&",
      }).save()
      console.log("Server Salvo na DataBase!")
    }

    const prefix = guildConfig.get("prefix");
    if (message.content.startsWith(prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);

      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
    if (!message.content.startsWith(prefix)) return;
  }
};
