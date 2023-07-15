import NDBClient from "@/Core/NDBClient";
import { GuildRepository } from "@/Database/Repositories";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Guild } from "discord.js";

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildCreate",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, guild: Guild) {
    const guildRepository = new GuildRepository();
    await guildRepository.create(guild);
  }
};
