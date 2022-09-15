import NDBClient from "@Client/NDBClient";
import { BaseEvent, BaseCommand } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { CommandTools } from "@Utils/Tools";
import { Message } from "discord.js";
import { Document } from "mongoose";

export default class CommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "Command",
      type: "on",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    message: Message,
    Prefix: string,
    UserProfile: Document
  ) {
    if (message.channel.isDMBased()) return;
    const cmdTools = new CommandTools(client);
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g);
    const _Command: BaseCommand = cmdTools.resolveCommand(cmd);

    if (_Command) {
      const Checker = await cmdTools.runCheck(
        message,
        _Command,
        UserProfile,
        Prefix,
        args
      );

      if (Checker) {
        _Command.run(client, message, args);
      }
    }
  }
}
