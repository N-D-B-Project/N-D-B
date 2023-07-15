import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class beforeExitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "beforeExit",
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: NDBClient, code) {
    client.logger.process("Before Exit", `Code: ${code}`);
  }
}
