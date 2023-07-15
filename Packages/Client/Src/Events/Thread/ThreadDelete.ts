/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { ThreadChannel } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "threadDelete",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, thread: ThreadChannel) {}
}
