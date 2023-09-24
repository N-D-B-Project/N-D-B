import { Config } from "@/Config/Config";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { LavalinkNode } from "lavalink-client";

export default class nodeRawEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "raw",
      type: "on",
      emitter: "music-node",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, node: LavalinkNode, payload: unknown) {
    if (Config.Debug.Lavalink) {
      // client.logger.music(
      //   `Raw ${"premium/common"} Lavalink Node`,
      //   `${node.options.id}, ${JSON.stringify(payload)}`
      // );
      console.log(payload);
    }
  }
}
