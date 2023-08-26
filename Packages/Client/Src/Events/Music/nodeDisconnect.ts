import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeDisconnectEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "disconnect",
      type: "on",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, node: LavalinkNode, { code, reason }) {
    client.logger.music(
      `Lavalink Node: ${node.options.id} Desconectado com\n Motivo: ${reason}\n código: ${code}`
    );
  }
}
