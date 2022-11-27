import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { Guild } from "discord.js";
import { GuildConfig } from "~/Database/Schemas";
import { EventOptions } from "~/Types";

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildDelete",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, guild: Guild) {
    await GuildConfig.DeleteConfig(client, guild);
  }
};
