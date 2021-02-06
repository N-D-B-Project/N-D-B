const BaseCommand = require("../Utils/Structures/BaseCommand");
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
      nsfw: true,
      args: true,
      ownerOnly: true,
      guildOnly: true,
      testOnly: true,
    });
  }

  async run(client, message, args) {
    
  }
}