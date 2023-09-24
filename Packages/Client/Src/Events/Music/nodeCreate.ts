import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeCreateEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "create",
      type: "once",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, node: LavalinkNode) {
    client.logger.music(`Lavalink Node: ${node.options.host} Criado!`);
  }
}
