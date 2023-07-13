import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { Node } from "erela.js"

export default class nodeRawEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeRaw",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, node: Node, payload: unknown) {
    client.logger.music(
      `Lavalink Node: ${node.options.identifier}, ${payload} Raw`
    )
  }
}
