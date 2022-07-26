import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
} from "discord.js";
import MsgDMCommand from "../🛠️ Developer Tools/MsgDM";

export default class ClearDMCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ClearDM",
      aliases: ["cleardm", "dmclear"],
      description: "Limpa as mensagens do Bot de sua DM",
      category: "📨 DM",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["SendMessages"],
        user: ["SendMessages"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: true,
      // SlashOptions: {
      //   name: "",
      //   ephemeral: true,
      //   description: "",
      // },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    var i: number = 0;
    await client.Tools.WAIT(1000);
    await message.channel.messages.fetch().then(async (msgs) => {
      msgs.forEach(async (msg) => {
        await client.Tools.WAIT(1000);
        if (msg.deletable) {
          msg.delete();
          i++;
        }
      });
    });
    await client.Tools.WAIT(10000);
    // await MessageTools.send(message.channel, {
    const Message = message.channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00c26f")
            .setDescription(
              await client.Translate.DM(
                "📨 DM/ClearDM:Embed:Description",
                message.author,
                {
                  VALUE: i,
                }
              )
            )
            .setFooter({
              text: await client.Translate.DM(
                "📨 DM/ClearDM:Embed:Footer",
                message.author
              ),
            })
            .setTimestamp(),
        ],
      })
      .then(async (msg) => {
        msg.react("🗑️");
        const filter = (m) => m.author.id === message.author.id;
        await msg
          .awaitReactions({
            filter,
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then(async (reaction) => {
            if (reaction.first().emoji.name === "🗑️") {
              msg.delete();
            } else return;
          });
      });
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
