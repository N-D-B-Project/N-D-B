import { Command } from "@/common/decorators/Commands.decorator";
import { Config } from "@/types";
import { Services } from "@/types/Constants";
import { IDatabaseService } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { EmbedBuilder, codeBlock } from "discord.js";
import { inspect } from "util";
import { CommandContext } from "../Commands.context";

@Injectable()
export class EvalCommand {
  public constructor(
    @Inject(Services.Database) private readonly database: IDatabaseService
  ) {}

  @Command({
    legacy: {
      name: "eval",
      description: "",
      usage: ""
    },
    permissions: {
      user: [],
      bot: [],
      guildOnly: false,
      ownerOnly: true
    },
    category: "🛠️ Developer Tools",
    slash: {
      type: "Sub",
      deployMode: "Test",
      name: "eval"
    }
  })
  public async onCommandRun([client, context]: CommandContext) {
    await context.delete();
    const content = await context.getContent();
    const args = context.getArg("code", 0);
    try {
      if (
        this.database
          .ConfigRepo()
          .getOrThrow<Config["EvalBadKeys"]>("EvalBadKeys")
          .some(key => content.includes(key))
      ) {
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
