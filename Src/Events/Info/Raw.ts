import NDBClient from "@/Client/Client";
import { BaseEvent } from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const name = "raw"
    const options = {
      name: "raw",
      type: "once",
    }

    super(client, name, options);
  }

  async run(client: NDBClient) {

  }
};
