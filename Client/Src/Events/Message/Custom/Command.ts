import NDBClient from "@Client/NDBClient";
import BaseEvent from "@Structures/BaseEvent";
import BaseCommand from "@Structures/BaseCommand";
import { EventOptions } from "~/Types";
import { CommandTools } from "@Utils/Tools";
import * as Discord from "discord.js";
import * as Mongoose from "mongoose";

export default class CommandEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "Command",
      type: "on",
      emitter: "client",
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    message: Discord.Message,
    Prefix: string,
    UserProfile: Mongoose.Document,
    GuildConfig: Mongoose.Document
  ) {
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
        "message",
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
