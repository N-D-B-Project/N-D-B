import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";
import Setup from "@Structures/Buttons/Setup"

export default class Buttons {
  client: NDBClient;
  setup: Setup

  constructor(client) {
    this.client = client;
    this.setup = new Setup(client);
  }

  async Confirm(message: any) {
    return new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId("YES")
          .setLabel(await this.client.translate("Tools/Buttons:Labels:Confirm:YES", message))
          .setEmoji("719710630881525881")
          .setStyle("SUCCESS"),
        new Discord.MessageButton()
          .setCustomId("NO")
          .setLabel(await this.client.translate("Tools/Buttons:Labels:Confirm:NO", message))
          .setEmoji("719710607405875321")
          .setStyle("DANGER")
      )

  }

}
