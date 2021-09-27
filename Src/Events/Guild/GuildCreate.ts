import NDBClient from "@/Client/Client";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Mongoose from "@Tools/Mongoose";

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "guildCreate";
    const options = {
      name: "guildCreate",
      type: "on",
    };

    super(client, name, options);
  }

  async run(client: NDBClient, guild: Discord.Guild) {
    await client.MongoDB.CreateGuildConfig(guild);
  }
};
