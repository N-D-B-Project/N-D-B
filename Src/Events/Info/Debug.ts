import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class DebugEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "ready"
    const options = {
        name: "debug",
        type: "once"
    }
    
    super(client, name, options);
  }

  async run(client: NDBClient, info: any) {
    if(client.config.Debug.Client === true) client.logger.debug(info)
  }
};
