import NDBClient from "@/Client/Client";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class RawLimitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "rateLimit"
    const options = {
      name: "rateLimit",
      type: "once"
    }

    super(client, name, options);
  }

  async run(client: NDBClient, { route, timeout }) {
    if (client.Config.Debug.Client === true) client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`);
  }
};
