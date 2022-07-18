import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";

export default class uncaughtExceptionMonitorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "uncaughtExceptionMonitor",
      type: "on",
      emitter: "process",
    };

    super(client, options);
  }

  async run(client: NDBClient, error: Error, origin) {
    client.logger.process("Uncaught Exception Monitor");
  }
}
