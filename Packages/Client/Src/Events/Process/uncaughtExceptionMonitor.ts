/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class uncaughtExceptionMonitorEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "process",
      names: ["uncaughtExceptionMonitor"],
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, error: Error, origin) {
    client.logger.process("Uncaught Exception Monitor");
  }
}
