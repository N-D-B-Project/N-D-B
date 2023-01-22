import NDBClient from "@/Client/NDBClient"
import { EventOptions } from "@/Types"
import { BaseCommand, BaseEvent } from "@/Utils/Structures"
import { LegacyTools } from "@/Utils/Tools"
import { Message } from "discord.js"

export default class CommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "Command",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, message: Message, Prefix: string) {
    if (message.channel.isDMBased()) return
    const cmdTools = new LegacyTools(client)
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g)
    const _Command: BaseCommand = client.Tools.resolveCommand(cmd)

    if (_Command) {
      const Checker = await cmdTools.runCheck(
        message,
        _Command,
        // UserConfig,
        Prefix,
        args
      )

      if (Checker) {
        _Command.run(client, message, args)
      }
    }
  }
}
