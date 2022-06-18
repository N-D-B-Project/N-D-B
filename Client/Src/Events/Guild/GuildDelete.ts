import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import { Guild } from "discord.js";
import { EventOptions } from "~/Types";

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildDelete",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, guild: Guild) {
    client.Mongoose.DeleteGuildConfig(guild, "Guild Delete");

    const Player = client.ErelaManager.players.get(guild.id);
    if (!Player) return;
    if (guild.id === Player.guild) {
      Player.destroy();
    }
  }
};
