const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class Command extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: '',
      category: '',
      aliases: [''],
      usage: '',
      description: '',
      userPerms: [],
      botPerms: [],
      nsfw: ,
      args: ,
      ownerOnly ,
      guildOnly ,
    });
  }

  async run(client, message, args) {
    
  }
}