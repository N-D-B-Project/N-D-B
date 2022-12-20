import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"

export default class beforeExitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "beforeExit",
      type: "on",
      emitter: "process",
      enable: false
    }

    super(client, options)
  }

  async run(client: NDBClient, code) {
    client.logger.process("Before Exit", `Code: ${code}`)
  }
}
