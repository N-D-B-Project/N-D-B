import { Config } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class DebugEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "debug",
      type: "once",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, info: string) {
    if (Config.Debug.Client === true) client.logger.debug(`Client: ${info}`);
  }
}
