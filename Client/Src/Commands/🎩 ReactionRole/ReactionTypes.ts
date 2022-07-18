import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import { MessageTools, InteractionTools } from "@Utils/Tools";
import { BaseCommand } from "@Utils/Structures";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  EmbedBuilder,
} from "discord.js";

export default class ReeactionTypesCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReeactionTypes",
      aliases: ["RTypes", "reactiontypes"],
      description: "Mostra todos os tipos de Reaction Roles",
      category: "🎩 ReactionRole",
      usage: "",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 0,
      maxArgs: 0,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false,
      // SlashOptions: {
      //   name: "",
      //   ephemeral: "",
      //   description: ""
      // }
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Message, args: Array<string>) {
    const msg = await MessageTools.send(message.channel, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setDescription(
            await client.translate(
              "🎩 ReactionRole/ReactionTypes:Types",
              message
            )
          )
          .setColor("#00c26f")
          .setTimestamp(),
      ],
    });
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
