const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
//const {} = require("../../../Config/Abbreviations.js");
const Levels = require("discord-xp");

module.exports = class LevelCommand extends BaseCommand {
  constructor() {
    super(
      'level', //name
      'LevelXP', //category
      ['nivel'], //aliases
      '', //usage
      'Mostra seu LevelXP' //description
    );
  }

  async run(client, message, args) {

    const target = message.author;

    const user = await Levels.fetch(message.author.id, message.guild.id);
    Channel.send(`${target} Você está no nível **${user.level}**!`);
  }
}