import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Erela from "erela.js"

export default class nodeErrorEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeError",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, node: Erela.Node, error: Error) {
    client.logger.music(`Lavalink Node Error: ${node.options.identifier} | ${error.message}`);
  }
}