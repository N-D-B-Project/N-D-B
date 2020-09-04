const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class RMLCommand extends BaseCommand {
  constructor() {
    super("RML", "Moderation", []);
  }

  async run(client, message, args) {
    message.channel.send("<a:MJa_RicardoMilosLenda:665847403269586955>");
  }
};
