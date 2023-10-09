/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand, Context } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { EmbedBuilder, MessageReaction, User } from "discord.js";

export default class ClearDMCommand extends BaseCommand {
  public constructor(protected client: INDBClient) {
    const options: CommandOptions = {
      name: "clear_dm",
      aliases: ["cleardm", "dmclear", "ClearDM"],
      description: "Limpa as mensagens do Bot de sua DM",
      category: "📨 DM",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"],
        guildOnly: false,
        ownerOnly: false
      },
      minArgs: 0,
      maxArgs: 0,
      nsfw: false,
      ndcash: 0,
      DM: true,
      slash: {
        type: "Sub"
      }
    };
    super(client, options);
  }

  public async run({ client, channel, author }: Context) {
    let i: number = 0;
    await client.Tools.WAIT(1000);
    await author.dmChannel.messages.fetch().then(async msgs => {
      msgs.forEach(async msg => {
        await client.Tools.WAIT(1000);
        if (msg.deletable) {
          msg.delete();
          i++;
        }
      });
    });
    await client.Tools.WAIT(5000);
    const msg = await MessageTools.send(channel, {
      embeds: [
        new EmbedBuilder()
          .setColor("#00c26f")
          .setDescription(
            await client.Translate.DM("DM/ClearDM:Embed:Description", author, {
              VALUE: i
            })
          )
          .setFooter({
            text: await client.Translate.DM("DM/ClearDM:Embed:Footer", author)
          })
          .setTimestamp()
      ]
    });

    msg.react("🗑️");
    const filter = (reaction: MessageReaction, user: User) => {
      return user.id === author.id && reaction.emoji.name === "🗑️";
    };
    msg
      .createReactionCollector({
        filter,
        max: 1,
        time: 60000
      })
      .on("collect", async (reaction: MessageReaction) => {
        msg.delete();
      });
  }
}
