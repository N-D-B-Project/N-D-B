const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class RMLCommand extends BaseCommand {
  constructor() {
    super(
      'RML', //name
      'Moderation', //category
      ['RicardoMilos', 'RichardMilos', 'Lenda'], //aliases
      '', //usage
      'Manda um Emoji do Milos' //description
    );
  }

  async run(client, message, args) {
    message.delete().catch((O_o) => {});
    message.channel.send("<a:MJa_RicardoMilosLenda:665847403269586955>");
  }
};
