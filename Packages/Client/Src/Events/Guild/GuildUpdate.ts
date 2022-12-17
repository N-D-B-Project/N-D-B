import NDBClient from "@Client/NDBClient"
import { BaseEvent } from "@Utils/Structures"
import { Guild } from "discord.js"
import { GuildRepository } from "~/Database/Repositories"
import { EventOptions } from "~/Types"

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildUpdate",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, oldGuild: Guild, newGuild: Guild) {
    const guildRepository = new GuildRepository(client)
    await guildRepository.update(oldGuild, newGuild)
  }
}
