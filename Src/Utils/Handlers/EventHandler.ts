import NDBClient from "@/Client/Client";
const BaseEvent = require("@Structures/BaseEvent");
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export default class EventHandler {
  private client: NDBClient;

  constructor(client: NDBClient) {
    this.client = client;
  }

  isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async loadEvents() {
    return globProm(`${this.directory}events/**/*.ts`).then((events: any) => {
      for (const eventFile of events) {
        delete require.cache[eventFile];
        const { name } = path.parse(eventFile);
        const File = require(eventFile);
        if (!this.isClass(File))
          throw new TypeError(
            `Event: ${name} não exportou uma Class // Ou não é um Evento do DiscordJS`
          );
        const event = new File(this.client, name);
        if (!(event instanceof BaseEvent))
          throw new TypeError(`Event: ${name} não esta em Events`);
        this.client.collections.events.set(event.name, event);
        if (event.manyArgs === 2) {
          event.emitter[event.type](event.name, (args: any, args2: any) =>
            event.run(this.client, args, args2)
          );
        } else {
          event.emitter[event.type](event.name, (args: any) =>
            event.run(this.client, args)
          );
        }
      }
    });
  }
}
