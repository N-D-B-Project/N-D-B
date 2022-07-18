import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { Config } from "~/Config/Config";
import { BaseEvent } from "@Utils/Structures";

export default class DebugEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "debug",
      type: "once",
      emitter: "client",
    };

    super(client, options);
  }

  async run(client: NDBClient, info: any) {
    if (Config.Debug.Client === true) client.logger.debug(info);
  }
}
