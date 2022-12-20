import NDBClient from "@/Client/NDBClient"
import { Config } from "@/Config/Config"
import { BaseEvent } from "@/Utils/Structures"
import { EventOptions } from "@n-d-b/types"

export default class DebugEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "debug",
      type: "once",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, info: any) {
    if (Config.Debug.Client === true) client.logger.debug(info)
  }
}
