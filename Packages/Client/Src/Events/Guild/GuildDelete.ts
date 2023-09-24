import MusicTools from "@/Modules/Music/Utils/Tools";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "guildDelete",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, guild: Guild) {
    const guildData = await client.database.GuildRepo.get(guild.id);
    const { Premium } = guildData.Settings;

    const Player = await MusicTools.getPlayer(client, guild.id, Premium);
    if (Player.guildId === guild.id) {
      Player.destroy();
    }

    await client.database.GuildRepo.delete(guild);
  }
};
