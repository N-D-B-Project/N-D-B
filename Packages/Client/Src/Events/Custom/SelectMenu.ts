import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { AnySelectMenuInteraction } from "discord.js"

export default class SelectMenuEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "SelectMenu",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, interaction: AnySelectMenuInteraction) {
    await interaction.deferUpdate()
  }
}
