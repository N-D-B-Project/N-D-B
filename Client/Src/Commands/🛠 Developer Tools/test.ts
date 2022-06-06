import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";
import { InteractionTools, MessageTools } from "@Utils/Tools";

export default class TestCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "test",
      aliases: ["t"],
      description: "Command to test things",
      category: "🛠 Developer Tools",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        user: [],
        bot: [],
      },
      guildOnly: false,
      ownerOnly: true,
      nsfw: false,
      ndcash: 0,
      SlashOptions: {
        name: "test",
        ephemeral: false,
        description: "Command to test things",
      },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Discord.Message, args: Array<string>) {
    const msg = await MessageTools.send(message.channel, {
      content: await client.translate("🛠 Developer Tools/test:Test", message),
      embeds: [],
      components: [],
    });

    await client.Tools.WAIT(3000);

    MessageTools.edit(
      msg,
      await client.translate("🛠 Developer Tools/test:Tested", message)
    );
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args: Discord.CommandInteractionOptionResolver
  ) {
    InteractionTools.reply(
      interaction,
      {
        content: await client.translate(
          "🛠 Developer Tools/test:Test",
          interaction
        ),
        embeds: [],
        components: [],
      },
      this.options.SlashOptions.ephemeral
    );

    await client.Tools.WAIT(3000);

    InteractionTools.editReply(
      interaction,
      await client.translate("🛠 Developer Tools/test:Tested", interaction)
    );
  }
}
