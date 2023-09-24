import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class Event extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "raw",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: INDBClient, data) {
    client.MusicManager.common.sendRawData(data);
    client.MusicManager.premium.sendRawData(data);
  }
}
