import NDBClient from "@/Core/NDBClient";
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
    const guildData = await client.database.GuildRepo.get(guild.id);
    const { Premium } = guildData.Settings;

    const Player = await MusicTools.getPlayer(client, guild.id, Premium);
    if (Player.guildId === guild.id) {
      Player.destroy();
    }

    await client.database.GuildRepo.delete(guild);
  }
};
