const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class SayCommand extends BaseCommand {
  constructor() {
    super("say", "Moderation", []);
  }

  async run(client, message, args) {
    //if (message.author.id === 330047048009252864) {
    const sayMessage = args.join(" ");
    message.delete().catch((O_o) => {});
    message.channel.send(sayMessage);
    //} else {
    //message.channel.send("Somente meu Dono pode usar este comando seu Corno");
    //}
  }
};
