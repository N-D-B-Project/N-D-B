const BaseCommand = require("../../Utils/Structures/BaseCommand.js");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  
  constructor(...args) {
    super(...args, {
      name: 'test',
      category: 'Developer Tools',
      aliases: ['t'],
      usage: '',
      description: 'comando de teste',
      ownerOnly: true
    });
  }
  
  async run(client, message, args) {
    message.channel.send(await client.translate("Funciona", message));
  }
}