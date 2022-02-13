import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import { EventOptions } from "~/Types";
import * as Discord from "discord.js";

module.exports = class MessageCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "messageCreate",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, message: Discord.Message) {}
};
