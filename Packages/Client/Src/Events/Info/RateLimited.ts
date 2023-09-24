import { Config } from "@/Config/Config";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { RateLimitData } from "discord.js";

export default class rateLimitedEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "rateLimited",
      type: "once",
      emitter: "rest",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, { route, timeToReset }: RateLimitData) {
    if (Config.Debug.Client === true) {
      client.logger.error(`Rate limit: ${route} (Cooldown: ${timeToReset}ms)`);
    }
  }
}
