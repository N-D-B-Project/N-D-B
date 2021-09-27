import NDBClient from "@/Client/Client";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Mongoose from "@Tools/Mongoose";

module.exports = class GuildUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "guildUpdate";
    const options = {
      name: "guildUpdate",
      type: "on",
      manyArgs: 2,
    };

    super(client, name, options);
  }

  async run(client: NDBClient, oldGuild, newGuild) {
    await client.MongoDB.UpdateGuildConfig(oldGuild, newGuild);
  }
};
