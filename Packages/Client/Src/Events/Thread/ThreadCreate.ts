import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"
import { ThreadChannel } from "discord.js"

export default class ThreadCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "threadCreate",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, thread: ThreadChannel, newlyCreated: boolean) {
    if (thread.joinable && newlyCreated) {
      await thread.join()
    }
  }
}
