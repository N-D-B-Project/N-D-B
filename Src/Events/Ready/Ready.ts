import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import { EventOptions } from "~/Types";
import * as Discord from "discord.js";

export default class ReadyEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ready",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient) {
    client.ReadyState = true;

    //* Logs
    client.logger.ready(`${client.user.tag} Está Online!`);
    client.logger.event(`${client.Collections.events.size} Events`);
    client.logger.command(`${client.Collections.commands.size} Commands`);
  }
}
