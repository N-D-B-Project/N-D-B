import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";
import Setup from "@Structures/Embeds/Setup";

export default class Embeds {
  client: NDBClient;
  setup: Setup;

  constructor(client) {
    this.client = client;
    this.setup = new Setup(client);
  }

  async SyntaxError(message, prefix, cmdName, cmdUsage) {
    return new Discord.MessageEmbed()
      .setTitle(
        await this.client.translate("Tools/Embeds:SyntaxError:Title", message, {
          EMOJI: message.client.emoji.fail,
        })
      )
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        await this.client.translate(
          "Tools/Embeds:SyntaxError:Description",
          message,
          { PREFIX: prefix, CMD: cmdName, USAGE: cmdUsage }
        )
      )
      .setColor("#c20e00")
      .setFooter(
        message.client.user.tag,
        message.client.user.displayAvatarURL()
      )
      .setTimestamp();
  }
}
