/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Player, WebSocketClosedEvent } from "erela.js";

export default class socketClosedEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "socketClosed",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, player: Player, payload: WebSocketClosedEvent) {}
}
