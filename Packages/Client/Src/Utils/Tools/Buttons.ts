import { INDBClient } from "@/Types";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Context } from "../Structures";

export default class Buttons {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}

  async Confirm(context: Context): Promise<ActionRowBuilder> {
    return new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("YES")
        .setLabel(
          await this.client.Translate.Guild(
            "Tools/Buttons:Labels:Confirm:YES",
            context
          )
        )
        .setEmoji("719710630881525881")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("NO")
        .setLabel(
          await this.client.Translate.Guild(
            "Tools/Buttons:Labels:Confirm:NO",
            context
          )
        )
        .setEmoji("719710607405875321")
        .setStyle(ButtonStyle.Danger)
    ]);
  }
}
