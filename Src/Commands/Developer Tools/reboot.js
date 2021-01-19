const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class RebootCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'reboot', //name
      category: 'Developer Tools', //category
      aliases: ['reiniciar'], //aliases
      usage: '', //usage
      description: 'Reinicia o Bot', //description
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    message.channel.send("Reiniciando o Bot...");
    process.exit();
  }
}