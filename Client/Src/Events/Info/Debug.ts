import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";

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
    if (client.Config.Debug.Client === true) client.logger.debug(info);
  }
}
