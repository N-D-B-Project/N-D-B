import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";

export default class SelectMenuEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SelectMenu",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: Discord.SelectMenuInteraction) {
    interaction.deferUpdate();
  }
}
