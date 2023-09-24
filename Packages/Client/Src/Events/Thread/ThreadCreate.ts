import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { ThreadChannel } from "discord.js";

export default class ThreadCreateEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "threadCreate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, thread: ThreadChannel, newlyCreated: boolean) {
    if (thread.joinable && newlyCreated) {
      await thread.join();
    }
  }
}
