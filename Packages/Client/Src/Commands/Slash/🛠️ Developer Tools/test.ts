import NDBClient from "@/Client/NDBClient"
import { BaseSlashCommand } from "@/Utils/Structures"
import { InteractionTools } from "@/Utils/Tools"
import { SlashCommandOptions } from "@n-d-b/types"
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js"

export default class TestCommand extends BaseSlashCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SlashCommandOptions = {
      data: {
        name: "test",
        description: "test"
      },
      category: "🛠 Developer Tools",
      disable: false,
      cooldown: 1000,
      permissions: {
        user: ["SendMessages"],
        bot: ["SendMessages"]
      },
      deployMode: "Test",
      ownerOnly: true,
      nsfw: false,
      ndcash: 0
    }
    super(client, options, args)
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    await InteractionTools.reply(interaction, {
      content: await client.Translate.Guild(
        "🛠 Developer Tools/test:Test",
        interaction
      ),
      embeds: [],
      components: []
    })

    await client.Tools.WAIT(1000)

    InteractionTools.editReply(
      interaction,
      await client.Translate.Guild("🛠 Developer Tools/test:Tested", interaction)
    )
  }
}
