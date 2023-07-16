/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { SlashCommandOptions } from "@/Types";
import { BaseSlashCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class TestCommand extends BaseSlashCommand {
  constructor(client: NDBClient, args: CommandInteractionOptionResolver) {
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
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    await InteractionTools.reply(
      interaction,
      {
        content: await client.Translate.Guild(
          "DeveloperTools/test:Test",
          interaction
        ),
        embeds: [],
        components: []
      },
      false
    );

    await client.Tools.WAIT(1000);

    InteractionTools.editReply(
      interaction,
      await client.Translate.Guild("DeveloperTools/test:Tested", interaction)
    );
  }
}
