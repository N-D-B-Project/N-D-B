import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "guildUpdate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, oldGuild: Guild, newGuild: Guild) {
    await client.database.GuildRepo.update(oldGuild, newGuild);
  }
};
