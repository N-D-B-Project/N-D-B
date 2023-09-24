import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class beforeExitEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "beforeExit",
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, code) {
    client.logger.process("Before Exit", `Code: ${code}`);
  }
}
