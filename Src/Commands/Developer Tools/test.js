const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const language = require("../../utils/Language");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'test', //name
      category: 'Developer Tools', //category
      aliases: ['t'], //aliases
      usage: '', //usage
      description: 'comando de teste', //description
      testOnly: true,
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    const { guild } = message;
    message.channel.send(`${language(guild, 'TEST_COMMAND')}`)
  }
}