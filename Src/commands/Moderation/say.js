const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class say extends BaseCommand {
  constructor() {
    super("say", "diga", "dizer", []);
  }

  async run(client, message, args) {
    const sayMessage = args.join(" ");
    message.delete().catch((O_o) => {});
    message.channel.send(sayMessage);
  }
};
