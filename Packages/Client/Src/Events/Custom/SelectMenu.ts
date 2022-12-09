import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";
import { SelectMenuInteraction } from "discord.js";

export default class SelectMenuEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SelectMenu",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: SelectMenuInteraction) {
    await interaction.deferUpdate();
  }
}
