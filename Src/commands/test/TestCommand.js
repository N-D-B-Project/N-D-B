const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const AB = process.env;
//const AB = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super("test", "Test", []);
  }

  async run(client, message, args) {
    message.channel.send("Test command works");
  }
};
