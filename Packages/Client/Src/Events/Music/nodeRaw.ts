import { Config } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeRawEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "raw",
      type: "on",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, node: LavalinkNode, payload: unknown) {
    if (Config.Debug.Lavalink) {
      // client.logger.music(
      //   `Raw ${"premium/common"} Lavalink Node`,
      //   `${node.options.id}, ${JSON.stringify(payload)}`
      // );
      console.log(payload);
    }
  }
}
