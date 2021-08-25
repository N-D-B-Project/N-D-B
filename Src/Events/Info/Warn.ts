import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class WarnEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "warn"
    const options = {
        name: "warn",
        type: "once"
    }
    
    super(client, name, options);
  }

  async run(client: NDBClient, info) {
    client.logger.warn(info)
  }
};
