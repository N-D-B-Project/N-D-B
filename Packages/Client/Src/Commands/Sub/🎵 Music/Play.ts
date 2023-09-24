import Music from "@/Modules/Music";
import { SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class PlaySubCommand extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "play",
      category: "🎵 Music",
      disable: false,
      cooldown: 0,
      permissions: {
        bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
        user: ["Connect", "SendMessages"]
      },
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      deployMode: "Test"
    };
    super(client, options, args);
  }

  async run(
    client: INDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const music = new Music(client);
    const play = await music.Play({ MsgInt: interaction, args }, true);
    InteractionTools.reply(interaction, play, false);
  }
}
