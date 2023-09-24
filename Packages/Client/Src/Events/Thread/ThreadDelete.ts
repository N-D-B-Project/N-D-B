/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { ThreadChannel } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "threadDelete",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, thread: ThreadChannel) {}
}
