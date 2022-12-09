import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { Guild } from "discord.js";
import { GuildConfig } from "~/Database/Schemas";
import { EventOptions } from "~/Types";

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildUpdate",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, oldGuild: Guild, newGuild: Guild) {
    await GuildConfig.UpdateConfig(client, oldGuild, newGuild);
  }
};
