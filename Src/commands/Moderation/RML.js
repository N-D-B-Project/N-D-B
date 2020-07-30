const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class RML extends BaseCommand {
  constructor() {
    super("Lenda", "RichardMilos", []);
  }

  async run(client, message, args) {
    message.channel.send("<a:MJa_RicardoMilosLenda:665847403269586955>");
  }
};
