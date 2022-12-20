import NDBClient from "@/Client/NDBClient"
import { GuildRepository } from "@/Database/Repositories"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"
import { Guild } from "discord.js"

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildCreate",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, guild: Guild) {
    const guildRepository = new GuildRepository()
    await guildRepository.create(guild)
  }
}
