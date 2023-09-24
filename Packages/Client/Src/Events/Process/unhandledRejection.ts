import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class unhandledRejectionEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "unhandledRejection",
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, reason: Error, promise) {
    client.logger.process(
      "Unhandled Rejection",
      `Reason in: ${promise} Error: ${
        reason.stack ? String(reason.stack) : String(reason)
      }`
    );
  }
}
