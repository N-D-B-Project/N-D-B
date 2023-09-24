import { EvalBadKeys } from "@/Config/Config";
import { INDBClient, SlashCommandOptions } from "@/Types";
import { BaseSlashCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  codeBlock
} from "discord.js";
import { inspect } from "util";

export default class EvalCommand extends BaseSlashCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SlashCommandOptions = {
      data: {
        name: "eval",
        description:
          "Evaluate some codes to test it without restart the bot every time",
        options: [
          {
            name: "code",
            description: "Code to begin evaluated",
            type: ApplicationCommandOptionType.String
          }
        ]
      },
      category: "🛠 Developer Tools",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: ["SendMessages"],
        bot: ["SendMessages"]
      },
      deployMode: "Global",
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const CodeToEval = args.getString("code");
    try {
      if (EvalBadKeys.some(key => CodeToEval.toLowerCase().includes(key))) {
        MessageTools.send(interaction.channel, {
          content: "BAD_KEY DETECTED ABORTING EVALUATION"
        });
        return;
      }
      var evalCode = inspect(await eval(CodeToEval), {
        depth: 0
      }).substring(0, 950);

      MessageTools.send(interaction.channel, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluated with Success")
            .setColor("#00c26f")
            .setDescription(
              `> Input:\n${codeBlock("TS", CodeToEval)}\n> Output:\n${codeBlock(
                "TS",
                evalCode
              )}`
            )
            .setTimestamp()
        ]
      });
    } catch (error) {
      MessageTools.send(interaction.channel, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Evaluate Error")
            .setColor("#c20e00")
            .setDescription(
              `> Input:\n${codeBlock("TS", CodeToEval)}\n> Error:\n${codeBlock(
                "SH",
                error as string
              )}`
            )
        ]
      });
    }
  }
}
