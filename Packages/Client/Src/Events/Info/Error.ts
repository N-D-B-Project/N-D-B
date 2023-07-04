import NDBClient from "@/Client/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

export default class ErrorEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "error",
      type: "once",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, error: Error) {
    client.logger.error("Client encontrou um erro: " + error)
  }
}
