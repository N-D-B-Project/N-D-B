import { EventOptions } from "@Types/Options";
import NDBClient from "@/Client/Client";

export default class BaseEvent {
  client: NDBClient;
  name: string;
  type: any;
  emitter?: any;
  options?: EventOptions;
  manyArgs?: number;

  constructor(client: NDBClient, name: string, options: any = {}) {
    this.name = options.name || name;
    this.client = client || options.client;
    this.type = options.once ? "once" : "on";
    this.manyArgs = options.manyArgs;
    this.emitter =
      (typeof options.emitter === "string"
        ? this.client[options.emitter]
        : options.emitter) || this.client;
  }

  async run(client: NDBClient, args: any, args2?: any) {
    throw new Error(`Um método Run não foi implementado em: ${this.name}`);
  }
}
