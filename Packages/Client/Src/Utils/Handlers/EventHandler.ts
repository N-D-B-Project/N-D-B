import NDBClient from "@/Client/NDBClient"
import { BaseEvent } from "@/Utils/Structures"
import fs from "fs"
import path from "path"
import { HandlerTools } from "."

export default class EventHandler {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  public async load() {
    const Tools = new HandlerTools()
    try {
      fs.readdirSync(`${Tools.directory}Events/`).forEach((dir: string) => {
        var eventDir: string[]
        switch (process.env.isCompiled) {
          case "true":
            eventDir = fs
              .readdirSync(`${Tools.directory}Events/${dir}`)
              .filter(file => file.endsWith(".js"))
            break
          case "false":
            eventDir = fs
              .readdirSync(`${Tools.directory}Events/${dir}`)
              .filter(file => file.endsWith(".ts"))
            break
        }

        for (const eventFile of eventDir) {
          delete require.cache[eventFile]
          const { name } = path.parse(eventFile)
          const File = Tools.findClass(
            require(`${Tools.directory}Events/${dir}/${eventFile}`)
          )
          if (!File) {
            throw new TypeError(`Event: ${name} não exportou uma Class`)
          }
          const event = new File(this.client, name)

          if (!(event instanceof BaseEvent)) {
            throw new TypeError(`Event: ${name} não esta em Events`)
          }
          this.client.Collections.events.set(String(event.options.name), event)

          var HandlerObject = [
            ...new Set([
              { emitter: "client", value: this.client },
              { emitter: "rest", value: this.client.rest },
              { emitter: "process", value: process }
            ])
          ]
            .map(object => {
              return {
                emitter: object.emitter,
                value: object.value
              }
            })
            .map(async object => {
              switch (event.options.emitter) {
                case String(object.emitter):
                  Object(object.value)[event.options.type](
                    event.options.name,
                    (...args: any[]) => {
                      if (event.options.enable) {
                        event.run(this.client, ...args)
                      }
                    }
                  )
                  break
              }
            })
        }
      })
    } catch (error) {
      this.client.logger.error("EventHandler ", error)
    }
  }
}
