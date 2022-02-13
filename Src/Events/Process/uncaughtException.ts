import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";

module.exports = class uncaughtExceptionEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "uncaughtException",
      type: "on",
      emitter: "process",
    };

    super(client, options);
  }

  async run(client: NDBClient, error: Error, origin) {
    client.logger.process(
      "Uncaught Exception",
      `Exception in ${origin}: ${error.stack ? error.stack : error}`
    );
  }
};
