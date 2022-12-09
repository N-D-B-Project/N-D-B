import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";
import { Config } from "~/Config/Config";

export default class rateLimitedEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "rateLimited",
      type: "once",
      emitter: "rest",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient, { route, timeout }) {
    if (Config.Debug.Client === true)
      client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
  }
}
