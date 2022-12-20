import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"
import { ButtonInteraction } from "discord.js"

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
