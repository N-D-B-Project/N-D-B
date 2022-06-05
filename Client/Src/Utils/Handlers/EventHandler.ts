import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import path from "path";
import { promisify } from "util";
import { glob } from "glob";
const globProm = promisify(glob);

export default class EventHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  private isClass(input: any) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    );
  }

  private findClass(module: any) {
    if (module.__esModule) {
      const def = Reflect.get(module, "default");
      if (this.isClass(def)) {
        return def;
      }

      let _class = null;
      for (const prop of Object.keys(module)) {
        const ref = Reflect.get(module, prop);
        if (this.isClass(ref)) {
          _class = ref;
          break;
        }
      }

      return _class;
    }

    return this.isClass(module) ? module : null;
  }

  private get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  public async loadEvents() {
    var FilePath: string;
    switch (process.env.isCompiled) {
      case "false":
        FilePath = `Events/**/*.ts`;
        break;
      case "true":
        FilePath = `Events/**/*.js`;
        break;
    }
    return globProm(`${this.directory}${FilePath}`).then((events: any) => {
      for (const eventFile of events) {
        delete require.cache[eventFile];
        const { name } = path.parse(eventFile);
        const File = this.findClass(require(eventFile));
        if (!File) {
          throw new TypeError(
            `Event: ${name} não exportou uma Class || não é um Evento do Discord.JS`
          );
        }
        const event = new File(this.client, name);
        if (!(event instanceof BaseEvent)) {
          throw new TypeError(`Event: ${name} não esta em Events`);
        }
        this.client.Collections.events.set(String(event.options.name), event);

        var HandlerObject = [
          ...new Set([
            { emitter: "client", value: this.client },
            // { emitter: "music", value: this.client.ErelaManager },
            { emitter: "process", value: process },
          ]),
        ]
          .map((object) => {
            return {
              emitter: object.emitter,
              value: object.value,
            };
          })
          .map(async (object) => {
            switch (event.options.emitter) {
              case String(object.emitter):
                Object(object.value)[event.options.type](
                  event.options.name,
                  (...args: any[]) => {
                    event.run(this.client, ...args);
                  }
                );
                break;
            }
          });
      }
    });
  }
}
