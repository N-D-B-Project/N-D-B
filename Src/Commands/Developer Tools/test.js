const BaseCommand = require("../../Utils/Structures/BaseCommand.js");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const { Language } = require("../../Features/Language");

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
    const { guild } = message;
    const tmsg = "TEST_COMMAND"
    //message.channel.send(`${Language(guild, tmsg)}.`);
    //message.reply(instance.messageHandler.get(guild, tmsg));
    //message.channel.send(tmsg)
  }
}