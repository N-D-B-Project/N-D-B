import { EventOptions } from "@/Types"
import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"

export default class WarnEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "warn",
      type: "once",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, info) {
    client.logger.warn(info)
  }
}
