import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeErrorEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "error",
      type: "on",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, node: LavalinkNode, error: Error) {
    client.logger.music(
      `Lavalink Node Error: ${node.options.id} | ${error.message}`
    );
  }
}
