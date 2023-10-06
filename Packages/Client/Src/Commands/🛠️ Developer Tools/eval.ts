import { EvalBadKeys } from "@/Config/Config";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { EmbedBuilder, codeBlock } from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends BaseCommand {
  constructor(client: INDBClient) {
    const options: CommandOptions = {
      name: "eval",
      aliases: [""],
      description:
        "Evaluate some codes to test it without restart the bot every time",
      category: "🛠️ Developer Tools",
      usage: "<code>",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"],
        guildOnly: false,
        ownerOnly: true
      },
      minArgs: 0,
      maxArgs: Infinity,
      nsfw: false,
      ndcash: 0,
      DM: false,
      slash: {
        type: "Sub"
      }
    };
    super(client, options);
  }

  async run(client: INDBClient, context: Context) {
    await context.delete();
    const content = await context.getContent();
    const args = context.getArg("code", 0).toString();
    try {
      // console.log(args);
      if (EvalBadKeys.some(key => content.includes(key))) {
        return await context.send({
          content: "BAD_KEY DETECTED ABORTING EVALUATION"
        });
      }
      var evalCode = inspect(await eval(args), {
        depth: 0
      }).substring(0, 950);
      return context.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluated with Success")
            .setColor("#00c26f")
            .setDescription(
              `> Input:\n${codeBlock("TS", args)}\n> Output:\n${codeBlock(
                "TS",
                evalCode
              )}`
            )
            .setTimestamp()
        ]
      });
    } catch (error) {
      return context.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluate Error")
            .setColor("#c20e00")
            .setDescription(
              `> Input:\n${codeBlock("TS", args)}\n> Error:\n${codeBlock(
                "SH",
                error as string
              )}`
            )
        ]
      });
    }
  }
}
