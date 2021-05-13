const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class RMLCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'RML',
      category: 'Developer Tools',
      aliases: ['RicardoMilos', 'RichardMilos', 'Lenda'],
      usage: '', //usage
      description: 'Manda um Emoji do Milos',
      ownerOnly: true,
    });
  }

  async run(client, message, args) {
    message.delete().catch((O_o) => {});
    message.channel.send("<a:MJa_RicardoMilosLenda:665847403269586955>");
  }
};
