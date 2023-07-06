import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseCommand, BaseEvent } from "@/Utils/Structures"
import { LegacyTools } from "@/Utils/Tools"
import { Message } from "discord.js"

export default class DMCommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "DMCommand",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, message: Message, Prefix: string) {
    const cmdTools = new LegacyTools(client)
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g)
    const _Command: BaseCommand = client.Tools.resolveCommand(cmd)

    if (_Command) {
      const Checker = await cmdTools.runCheckDM(message, _Command, Prefix, args)

      if (Checker) {
        _Command.run(client, message, args)
      }
    }
  }
}
