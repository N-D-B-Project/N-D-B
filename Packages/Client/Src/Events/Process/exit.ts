import { EventOptions } from "@/Types"
import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"

export default class ExitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "exit",
      type: "on",
      emitter: "process",
      enable: false
    }

    super(client, options)
  }

  async run(client: NDBClient, code) {
    client.logger.process("Exit", `Code: ${code}`)
  }
}
