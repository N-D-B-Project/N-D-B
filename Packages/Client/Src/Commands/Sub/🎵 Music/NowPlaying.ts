import Music from "@/Modules/Music";
import { SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver
} from "discord.js";

export default class Command extends BaseSubCommand {
  constructor(client: INDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "now_playing",
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
    args: CommandInteractionOptionResolver,
    premium?: boolean
  ) {
    const music = new Music(client);
    const nowplaying = await music.NowPlaying(
      { MsgInt: interaction },
      true,
      premium
    );
    await InteractionTools.reply(interaction, nowplaying, false);
  }
}
