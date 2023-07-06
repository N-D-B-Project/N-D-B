import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { ContextMenuCommandInteraction } from "discord.js"

export default class ContextMenuEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ContextMenu",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, interaction: ContextMenuCommandInteraction) {}
}
