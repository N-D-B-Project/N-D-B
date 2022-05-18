import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Erela from "erela.js"

export default class playerDestroyEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerDestroy",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, player: Erela.Player) {
    const guild = client.guilds.cache.get(player.guild) as Discord.Guild;
    client.logger.info(`Player finalizado no servidor: ${guild.name}(${guild.id})`);
  }
}