import { Config } from "@/Config/Config";
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class DebugEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "debug",
      type: "once",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, info: string) {
    if (Config.Debug.Client === true) client.logger.debug(`Client: ${info}`);
  }
}
