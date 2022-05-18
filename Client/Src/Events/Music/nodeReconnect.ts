import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Erela from "erela.js"

export default class nodeReconnectEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeReconnect",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, node: Erela.Node) {
    client.logger.music(`Lavalink Node: ${node.options.identifier} Reconectado`);
  }
}