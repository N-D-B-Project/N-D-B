import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class WarnEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "warn",
      type: "once",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, info) {
    client.logger.warn(info);
  }
}
