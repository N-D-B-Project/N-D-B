import NDBClient from "@/Core/NDBClient"
import { GuildRepository } from "@/Database/Repositories"
import MusicTools from "@/Modules/Music/Utils/Tools"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { GuildMember } from "discord.js"

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildMemberRemove",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, member: GuildMember) {
    if (member.id === client.user.id) {
      const guildRepository = new GuildRepository()
      await guildRepository.delete(member.guild)

      await (await MusicTools.getPlayer(client, member.guild.id)).destroy()
    }
  }
}
