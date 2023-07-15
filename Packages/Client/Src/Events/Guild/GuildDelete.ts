import NDBClient from "@/Core/NDBClient";
import { GuildRepository } from "@/Database/Repositories";
import MusicTools from "@/Modules/Music/Utils/Tools";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildDelete",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, guild: Guild) {
    const guildRepository = new GuildRepository();
    await guildRepository.delete(guild);

    const Player = await MusicTools.getPlayer(client, guild.id);
    if (Player.guild === guild.id) {
      Player.destroy();
    }
  }
};
