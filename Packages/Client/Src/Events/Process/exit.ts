import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class ExitEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "exit",
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, code) {
    client.logger.process("Exit", `Code: ${code}`);
  }
}
