const BaseEvent = require("../../utils/structures/BaseEvent");
const GuildConfig = require("../../database/schemas/GuildConfig");
const Config = require("../../../Config/Config.json");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message) {
    if (message.author.bot) return;
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });
    // const cprefix = Config.prefix;
    // const DBPrefix = guildConfig.get("prefix");
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
/*
    if (message.content.startsWith(cprefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(cprefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
*/
    /*
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
        .slice(client.prefix.length)
        .trim()
        .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
*/
    // if (!message.content.startsWith(client.prefix)) return;
    if (!message.content.startsWith(prefix)) return;
  }
};
