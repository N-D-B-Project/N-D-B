const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class say extends BaseCommand {
  constructor() {
    super("say", "Moderation", []);
  }

  async run(client, message, args) {
    if (message.member.id === 330047048009252864) {
      const sayMessage = args.join(" ");
      message.delete().catch((O_o) => {});
      message.channel.send(sayMessage);
    }
    if (!message.member.id === 330047048009252864) {
      message.channel.send("Somente meu Domo pode usar este comando seu Corno");
    }
  }
};
