import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { Guild } from "discord.js";
import { EventOptions } from "~/Types";

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildUpdate",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, oldGuild: Guild, newGuild: Guild) {
    await client.Mongoose.UpdateGuildConfig(oldGuild, newGuild);
  }
};
