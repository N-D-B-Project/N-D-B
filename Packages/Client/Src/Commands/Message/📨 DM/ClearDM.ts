import NDBClient from "@/Core/NDBClient"
import { CommandOptions } from "@/Types"
import { BaseCommand } from "@/Utils/Structures"
import { MessageTools } from "@/Utils/Tools"
import { EmbedBuilder, Message, MessageReaction, User } from "discord.js"

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
        user: ["SendMessages"]
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: true
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    var i: number = 0
    await client.Tools.WAIT(1000)
    await message.channel.messages.fetch().then(async msgs => {
      msgs.forEach(async msg => {
        await client.Tools.WAIT(1000)
        if (msg.deletable) {
          msg.delete()
          i++
        }
      })
    })
    await client.Tools.WAIT(5000)
    const msg = await MessageTools.send(message.channel, {
      embeds: [
        new EmbedBuilder()
          .setColor("#00c26f")
          .setDescription(
            await client.Translate.DM(
              "📨 DM/ClearDM:Embed:Description",
              message.author,
              {
                VALUE: i
              }
            )
          )
          .setFooter({
            text: await client.Translate.DM(
              "📨 DM/ClearDM:Embed:Footer",
              message.author
            )
          })
          .setTimestamp()
      ]
    })

    msg.react("🗑️")
    const filter = (reaction: MessageReaction, user: User) => {
      return user.id === message.author.id && reaction.emoji.name === "🗑️"
    }
    msg
      .createReactionCollector({
        filter,
        max: 1,
        time: 60000
      })
      .on("collect", async (reaction: MessageReaction) => {
        msg.delete()
      })
      .on("end", async () => {
        return
      })
  }
}
