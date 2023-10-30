import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";

export default class beforeExitEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "process",
      names: ["beforeExit", "SIGKILL", "SIGINT", "SIGTERM"],
      type: "on",
      emitter: "process",
      enable: false
    };

    super(client, options);
  }

  async run(client: INDBClient, code) {
    try {
      const logger = client.logger;
      client.removeAllListeners();
      await client.database.Disconnect("Before Exit Event");
      await client.destroy();
      logger.info("Cleanup complete. Exiting...");
      process.exit(0);
    } catch (error) {
      client.logger.error(`Error during termination: ${error}`);
    }
    client.logger.process("Before Exit", `Code: ${code}`);
  }
}
