const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super("test", "testing", []);
  }

  async run(client, message, args) {
    message.channel.send("Test command works");
  }
};
