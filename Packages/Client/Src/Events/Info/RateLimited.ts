import NDBClient from "@/Client/NDBClient"
import { Config } from "@/Config/Config"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"

export default class rateLimitedEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "rateLimited",
      type: "once",
      emitter: "rest",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, { route, timeout }) {
    if (Config.Debug.Client === true)
      client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`)
  }
}
