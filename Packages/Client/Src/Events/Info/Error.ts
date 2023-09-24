import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class ErrorEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "error",
      type: "once",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, error: Error) {
    client.logger.error("Client encontrou um erro: " + error);
  }
}
