import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { Node } from "erela.js"

export default class nodeErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeError",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, node: Node, error: Error) {
    client.logger.music(
      `Lavalink Node Error: ${node.options.identifier} | ${error.message}`
    )
  }
}
