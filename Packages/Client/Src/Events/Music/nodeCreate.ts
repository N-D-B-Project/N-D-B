import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Node } from "erela.js";

export default class nodeCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "nodeCreate",
      type: "once",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, node: Node) {
    client.logger.music(`Lavalink Node: ${node.options.host} Criado!`);
  }
}
