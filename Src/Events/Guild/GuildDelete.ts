import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Mongoose from "@Tools/Mongoose";

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "guildDelete";
    const options = {
      name: "guildDelete",
      type: "on",
      manyArgs: 2,
    };

    super(client, name, options);
  }

  async run(client: NDBClient, guild: Discord.Guild) {
    client.MongoDB.DeleteGuildConfig(guild);
  }
};
