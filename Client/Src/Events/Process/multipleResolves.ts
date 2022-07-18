import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";

export default class multipleResolvesEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "multipleResolves",
      type: "on",
      emitter: "process",
    };

    super(client, options);
  }

  async run(client: NDBClient, type, promise, reason) {
    client.logger.process(
      "Multiple Resolves",
      `Type: ${type}, Promise: ${promise}, Reason ${reason}`
    );
  }
}
