import NDBClient from "@/Client/NDBClient"
import { BaseCommand } from "@/Utils/Structures"
import { MessageTools, Paginator } from "@/Utils/Tools"
import { CommandOptions } from "@n-d-b/types"
import { EmbedBuilder, Message } from "discord.js"

export default class TestCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "test",
      aliases: ["t"],
      description: "Command to test things",
      category: "🛠 Developer Tools",
      usage: "",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: [],
        bot: []
      },
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    }
    super(client, options, args)
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const msg = await MessageTools.send(message.channel, {
      content: await client.Translate.Guild(
        "🛠 Developer Tools/test:Test",
        message
      ),
      embeds: [],
      components: []
    })

    await client.Tools.WAIT(1500)

    MessageTools.edit(
      msg,
      await client.Translate.Guild("🛠 Developer Tools/test:Tested", message)
    )

    const TestEmbeds: Array<EmbedBuilder> = [
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("🛠 Developer Tools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "1" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("🛠 Developer Tools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "2" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("🛠 Developer Tools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "3" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("🛠 Developer Tools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "4" }),
      new EmbedBuilder()
        .setDescription(
          await client.Translate.Guild("🛠 Developer Tools/test:Embed", message)
        )
        .setColor("Random")
        .setFooter({ text: "5" })
    ]

    await Paginator(client, message, "Message", TestEmbeds)
  }
}
