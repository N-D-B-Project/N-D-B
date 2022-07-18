import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ready",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient) {
    //* Logs
    client.logger.ready(`${client.user.tag} Está Online!`);
    client.logger.event(`${client.Collections.events.size} Events`);
    client.logger.command(`${client.Collections.commands.size} Commands`);
  }
}
