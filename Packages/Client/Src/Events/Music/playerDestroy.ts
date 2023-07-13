import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { Guild } from "discord.js"
import { Player } from "erela.js"
export default class playerDestroyvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerDestroy",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, player: Player) {
    const guild = client.guilds.cache.get(player.guild) as Guild
    client.logger.info(
      `Player destruido no servidor: ${guild.name}(${guild.id})`
    )
  }
}
