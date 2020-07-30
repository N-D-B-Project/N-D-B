const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class RML extends BaseCommand {
  constructor() {
    super("RML", "Lenda", "RichardMilos", []);
  }

  async run(client, message, args) {
    message.channel.send("<a:MJa_RicardoMilosLenda:665847403269586955>");
  }
};
