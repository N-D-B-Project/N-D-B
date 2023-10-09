import { EventOptions, INDBClient } from "@/Types";
import { BaseCommand, BaseEvent, Context } from "@/Utils/Structures";
import { CommandChecker } from "@/Utils/Tools";
import { Message } from "discord.js";

export default class DMCommandEvent extends BaseEvent {
  public constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "DMCommand",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  public async run(client: INDBClient, message: Message, Prefix: string) {
    const cmdTools = new CommandChecker(client);
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g);
    const context = new Context(client, message, args as Array<string>, {});
    const _Command: BaseCommand = client.Tools.resolveCommand(cmd);
    if (_Command) {
      const Checker = await cmdTools.runCheck(context, _Command, Prefix, args);
      if (Checker) {
        _Command.run(context);
      }
    }
  }
}
