import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"

export default class unhandledRejectionEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "unhandledRejection",
      type: "on",
      emitter: "process",
      enable: false
    }

    super(client, options)
  }

  async run(client: NDBClient, reason: Error, promise) {
    client.logger.process(
      "Unhandled Rejection",
      `Reason in: ${promise} Error: ${
        reason.stack ? String(reason.stack) : String(reason)
      }`
    )
  }
}
