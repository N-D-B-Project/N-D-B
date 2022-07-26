import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";
import { ButtonInteraction } from "discord.js";

export default class ButtonClickEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ButtonClick",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, interaction: ButtonInteraction) {
    await interaction.update({ fetchReply: true });
  }
}