import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
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
  }
};