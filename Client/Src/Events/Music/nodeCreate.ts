import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Erela from "erela.js"

export default class nodeCreateEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeCreate",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, node: Erela.Node) {
    client.logger.music(`Lavalink Node: ${node.options.identifier} Criado!`)
  }
}