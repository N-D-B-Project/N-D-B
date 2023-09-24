import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "guildCreate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, guild: Guild) {
    const guildRepository = client.database.GuildRepo;
    await guildRepository.create(guild);
  }
};
