import { INDBClient } from "@/Types";
import { parse } from "path";
import { BaseEvent } from "../Structures";
import BaseHandler from "./BaseHandler";

export default class EventHandler {
  // eslint-disable-next-line no-empty-function
  public constructor(private client: INDBClient) {}

  async load() {
    this.client.Collections.events.clear();
    const baseHandler = new BaseHandler();

    const eventFiles = await baseHandler.getFiles("Events");
    eventFiles.forEach(async eventFile => {
      const { name } = parse(eventFile);
      const File = await baseHandler.findClass(await import(eventFile));
      if (!File) {
        throw new TypeError(`Event: ${name} não exportou uma Class`);
      }

      const event = new File(this.client, name.toLowerCase());
      if (!(event instanceof BaseEvent)) {
        throw new TypeError(`Event: ${name} não esta em Events`);
      }
      this.client.Collections.events.set(String(event.options.name), event);

      const HandlerList = [
        { emitter: "client", value: this.client },
        { emitter: "rest", value: this.client.rest },
        { emitter: "process", value: process },
        {
          emitter: "music",
          value: this.client.MusicManager.common
        },
        {
          emitter: "music-node",
          value: this.client.MusicManager.common.nodeManager
        },
        {
          emitter: "music",
          value: this.client.MusicManager.premium
        },
        {
          emitter: "music-node",
          value: this.client.MusicManager.premium.nodeManager
        }
      ];

      for (const Prop of HandlerList) {
        switch (event.options.emitter) {
          case String(Prop.emitter):
            Object(Prop.value)[event.options.type](
              event.options.name,
              (...args: unknown[]) => {
                if (event.options.enable) {
                  event.run(this.client, ...args);
                }
              }
            );
        }
      }

      // letHandlerObject = [...new Set([])]
      //   .map(object => {
      //     return {
      //       emitter: object.emitter,
      //       value: object.value
      //     }
      //   })
      //   .map(async object => {
      //     switch (event.options.emitter) {
      //       case String(object.emitter):
      //         Object(object.value)[event.options.type](
      //           event.options.name,
      //           (...args: Array<string>) => {
      //             if (event.options.enable) {
      //               event.run(this.client, ...args)
      //             }
      //           }
      //         )
      //         break
      //     }
      //   })
    });
  }
}
