import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import { BaseEvent } from "@Utils/Structures";

export default class beforeExitEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "beforeExit",
      type: "on",
      emitter: "process",
    };

    super(client, options);
  }

  async run(client: NDBClient, code) {
    client.logger.process("Before Exit", `Code: ${code}`);
  }
}
