import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeDisconnectEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "disconnect",
      type: "on",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, node: LavalinkNode, { code, reason }) {
    client.logger.music(
      `Lavalink Node: ${node.options.id} Desconectado com\n Motivo: ${reason}\n código: ${code}`
    );
  }
}
