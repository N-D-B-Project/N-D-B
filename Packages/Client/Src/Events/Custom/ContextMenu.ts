import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"
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
