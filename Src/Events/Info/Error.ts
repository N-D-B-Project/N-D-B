import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class ErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "error"
    const options = {
        name: "error",
        type: "once"
    }
    
    super(client, name, options);
  }

  async run(client: NDBClient, error: Error) {
    client.logger.error("Client encontrou um erro: " + error)
  }
};
