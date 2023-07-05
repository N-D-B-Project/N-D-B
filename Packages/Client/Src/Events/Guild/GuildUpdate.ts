import { EventOptions } from "@/Types"
import NDBClient from "@/Client/NDBClient"
import { GuildRepository } from "@/Database/Repositories"
import { BaseEvent } from "@/Utils/Structures"
import { Guild } from "discord.js"

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
    const guildRepository = new GuildRepository()
    await guildRepository.update(oldGuild, newGuild)
  }
}
