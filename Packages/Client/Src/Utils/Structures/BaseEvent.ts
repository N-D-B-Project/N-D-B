/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";

export default class BaseEvent {
  public constructor(
    protected client: INDBClient,
    public options: EventOptions
  ) {}

  async run(client: INDBClient, ...args: unknown[]): Promise<void | boolean> {
    throw new Error(
      `Um método Run não foi implementado em: ${this.options.name}`
    );
  }
}
