import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
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
