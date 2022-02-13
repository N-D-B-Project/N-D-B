import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";

module.exports = class WarnEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "warn",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, info) {
    client.logger.warn(info);
  }
};
