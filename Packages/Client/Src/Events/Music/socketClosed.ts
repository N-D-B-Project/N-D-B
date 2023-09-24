/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Player, WebSocketClosedEvent } from "lavalink-client";

export default class socketClosedEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "playerSocketClosed",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: INDBClient,
    player: Player,
    payload: WebSocketClosedEvent
  ) {}
}
