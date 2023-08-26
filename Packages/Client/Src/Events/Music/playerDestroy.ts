import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";
import { Player } from "lavalink-client";
export default class playerDestroyEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerDestroy",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, player: Player) {
    const guild = client.guilds.cache.get(player.guildId) as Guild;
    client.logger.info(
      `Player destruído no servidor: ${guild.name}(${guild.id})`
    );
  }
}
