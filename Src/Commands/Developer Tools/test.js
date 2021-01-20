const BaseCommand = require("../../Utils/Structures/BaseCommand.js");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'test', //name
      category: 'Developer Tools', //category
      aliases: ['t'], //aliases
      usage: '', //usage
      description: 'comando de teste', //description
      ownerOnly: true
    });
  }

  async run(client, message, args,) {
    const { guild } = message;
    message.channel.send();
  }
}