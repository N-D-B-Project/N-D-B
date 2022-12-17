import NDBClient from "@Client/NDBClient"
import { BaseEvent } from "@Utils/Structures"
import { Guild } from "discord.js"
import { EventOptions } from "~/Types"
import { GuildRepository } from "~/Database/Repositories"

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
    const guildRepository = new GuildRepository(client)
    await guildRepository.create(guild)
  }
}
