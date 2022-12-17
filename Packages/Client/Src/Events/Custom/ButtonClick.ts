import NDBClient from "@Client/NDBClient"
import { BaseEvent } from "@Utils/Structures"
import { ButtonInteraction } from "discord.js"
import { EventOptions } from "~/Types"

export default class ButtonClickEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ButtonClick",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, interaction: ButtonInteraction) {
    await interaction.update({ fetchReply: true })
  }
}
