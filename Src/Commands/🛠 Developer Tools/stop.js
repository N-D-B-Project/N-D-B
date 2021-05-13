const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const exec = require("child_process");

module.exports = class RebootCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'stop',
      category: 'Developer Tools',
      aliases: ['desligar'],
      usage: '', //usage
      description: 'Desliga o Bot',
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    message.channel.send("Desligando o Bot...");
    process.exit();
    client.destroy();
  }
}