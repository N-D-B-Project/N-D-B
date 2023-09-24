import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class uncaughtExceptionEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "uncaughtException",
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, error: Error, origin) {
    client.logger.process(
      "Uncaught Exception",
      `Exception in ${origin}: ${error.stack ? error.stack : error}`
    );
  }
}
