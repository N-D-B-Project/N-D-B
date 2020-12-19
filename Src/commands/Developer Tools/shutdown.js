const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ShutdownCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'shutdown', //name
      category: 'Developer Tools', //category
      aliases: ['desligar'], //aliases
      usage: '', //usage
      description: 'Deliga o Bot', //description
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    try {
        await message.channel.send("Desligando o Bot...");
        process.exit();
    } catch (error) {
        message.channel.send(`ERRO: ${error.message}`);
    }
  }
}