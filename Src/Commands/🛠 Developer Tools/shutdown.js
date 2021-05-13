const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class ShutdownCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'shutdown',
      category: 'Developer Tools',
      aliases: ['desligar'],
      usage: '',
      description: 'Deliga o Bot',
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