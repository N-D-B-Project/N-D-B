import { EventOptions } from "@/Types"
import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { GuildChannel } from "discord.js"

export default class channelDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "channelDelete",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, channel: GuildChannel) {}
}
