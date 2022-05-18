import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";

export default class rateLimitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "rateLimit",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, { route, timeout }) {
    if (client.Config.Debug.Client === true)
      client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
  }
}
