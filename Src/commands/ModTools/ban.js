const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
const AB = require("../../../Config/Abbreviations.json");

module.exports = class BanCommand extends BaseCommand {
  constructor() {
    super("ban", "ModTools", []);
  }

  async run(client, message, args) {
    const banEmoji = "<:MJb_banido:711695336363655198>";

    if (!message.member.hasPermission("BAN_MEMBERS")) {
      message.channel.send("Você não tem permissão para utilizar este comando");
    } else {
      try {
        let bannedMember = await message.guild.members.ban(args);
        if (bannedMember)
          message.delete().catch((O_o) => {});
          message.channel.send(bannedMember.tag + `B A N I D O ${banEmoji}`);
        //console.log(bannedMember.tag + `B A N I D O ${banEmoji}`);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
