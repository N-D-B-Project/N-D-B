import NDBClient from "@Client/NDBClient";
import * as Discord from "discord.js";

export default class Buttons {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async Confirm(
    msgint: Discord.Message | Discord.CommandInteraction
  ): Promise<Discord.MessageActionRow> {
    return new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("YES")
        .setLabel(
          await this.client.translate(
            "Tools/Buttons:Labels:Confirm:YES",
            msgint
          )
        )
        .setEmoji("719710630881525881")
        .setStyle("SUCCESS"),
      new Discord.MessageButton()
        .setCustomId("NO")
        .setLabel(
          await this.client.translate("Tools/Buttons:Labels:Confirm:NO", msgint)
        )
        .setEmoji("719710607405875321")
        .setStyle("DANGER")
    );
  }

  async Pages(
    msgint: Discord.Message | Discord.CommandInteraction,
    CurrentPage: number,
    EmbedsLength: number
  ): Promise<Discord.MessageActionRow> {
    return new Discord.MessageActionRow().addComponents(
      new Discord.MessageButton()
        .setCustomId("PREVIOUS")
        .setEmoji("⬅️")
        .setStyle("SECONDARY")
        .setDisabled(CurrentPage <= 1),
      new Discord.MessageButton()
        .setCustomId("NEXT")
        .setStyle("SECONDARY")
        .setEmoji("➡️")
        .setDisabled(!(CurrentPage < EmbedsLength))
    );
  }
}
