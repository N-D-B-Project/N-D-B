const BaseCommand = require("../../Utils/Structures/BaseCommand.js");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const { Language } = require("../../Features/Language");

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
  
  async run(client, message, args) {
    const { guild } = message;
    const tmsg = "TEST_COMMAND"
    //message.channel.send(`${Language(guild, tmsg)}.`);
    message.reply(instance.messageHandler.get(guild, tmsg));
  }
}