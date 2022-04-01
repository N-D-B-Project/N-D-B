import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Erela from "erela.js"

export default class trackExceptionEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackException",
      type: "on",
      emitter: "music"
    }

    super(client,  options);
  }

  async run(client: NDBClient, exception: Erela.Exception) {
    client.logger.log(exception.cause, exception.message, exception.severity)
  }
}