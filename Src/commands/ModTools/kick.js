const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.js");

module.exports = class KickCommand extends BaseCommand {
  constructor() {
    super("kick", "ModTools", []);
  }

  async run(client, message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS"))
      message.channel.send("Você não tem permissão para utilizar este comando");
    else {
      const member = message.guild.members.cache.get(args);
      if (member) {
        try {
          await member.kick();
          //console.log('A member was kicked.');
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
};
