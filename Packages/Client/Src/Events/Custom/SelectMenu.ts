import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { AnySelectMenuInteraction } from "discord.js";

export default class SelectMenuEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "SelectMenu",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, interaction: AnySelectMenuInteraction) {
    await interaction.deferUpdate();
  }
}
