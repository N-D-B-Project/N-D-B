import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { ButtonInteraction } from "discord.js";

export default class ButtonClickEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "ButtonClick",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, interaction: ButtonInteraction) {
    await interaction.update({ fetchReply: true });
  }
}
