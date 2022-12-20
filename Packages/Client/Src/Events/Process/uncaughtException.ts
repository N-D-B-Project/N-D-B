import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"

export default class uncaughtExceptionEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "uncaughtException",
      type: "on",
      emitter: "process",
      enable: false
    }

    super(client, options)
  }

  async run(client: NDBClient, error: Error, origin) {
    client.logger.process(
      "Uncaught Exception",
      `Exception in ${origin}: ${error.stack ? error.stack : error}`
    )
  }
}
