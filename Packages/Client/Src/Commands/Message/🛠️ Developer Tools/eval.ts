import { EvalBadKeys } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { CommandOptions } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { EmbedBuilder, Message, codeBlock } from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "eval",
      aliases: [""],
      description: "eval",
      category: "🛠️ Developer Tools",
      usage: "<code>",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"]
      },
      minArgs: 0,
      maxArgs: Infinity,
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    if (message.deletable) message.delete();
    try {
      if (
        EvalBadKeys.some(key => message.content.toLowerCase().includes(key))
      ) {
        MessageTools.send(message.channel, {
          content: "BAD_KEY DETECTED ABORTING EVALUATION"
        });
        return;
      }
      var evalCode = inspect(await eval(args.join(" ")), {
        depth: 0
      }).substring(0, 950);

      MessageTools.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluated with Success")
            .setColor("#00c26f")
            .setDescription(
              `> Input:\n${codeBlock(
                "TS",
                args.join(" ")
              )}\n> Output:\n${codeBlock("TS", evalCode)}`
            )
            .setTimestamp()
        ]
      });
    } catch (error) {
      MessageTools.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluate Error")
            .setColor("#c20e00")
            .setDescription(
              `> Input:\n${codeBlock(
                "TS",
                args.join(" ")
              )}\n> Error:\n${codeBlock("SH", error as string)}`
            )
        ]
      });
    }
  }
}
