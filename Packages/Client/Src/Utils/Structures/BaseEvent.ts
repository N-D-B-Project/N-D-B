/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";

export default class BaseEvent {
  public constructor(
    private client: INDBClient,
    public options: EventOptions
  ) {
    this.client = client;
    this.options.name = options.name;
    this.options.type = options.type;
    this.options.emitter = options.emitter;
  }

  async run(client: INDBClient, ...args: unknown[]) {
    throw new Error(
      `Um método Run não foi implementado em: ${String(this.options.name)}`
    );
  }
}
