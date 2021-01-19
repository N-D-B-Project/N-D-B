const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'config',
      category: 'Settings',
      aliases: ['configurar'],
      usage: '',
      description: 'Configura o Bot',
      userPerms: ["ADMINISTRATOR"],
    });
  }

  async run(client, message, args) {
    
  }
}