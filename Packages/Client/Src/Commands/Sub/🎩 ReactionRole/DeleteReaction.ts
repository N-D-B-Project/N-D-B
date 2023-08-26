import NDBClient from "@/Core/NDBClient";
import ReactionRole from "@/Modules/ReactionRole";
import { iReaction } from "@/Modules/ReactionRole/Types";
import {
  ReactionRoleRemovedEmbed,
  UnableToDeleteReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextBasedChannel
} from "discord.js";

export default class DeleteReactionCommand extends BaseSubCommand {
  constructor(client: NDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "delete",
      category: "🎩 ReactionRole",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      deployMode: "Test"
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const react: ReactionRole = new ReactionRole(client, "Delete");

    const Channel = args.getChannel("channel").id;
    const Message = args.getString("message");
    const Role = args.getRole("role").id;
    const Emoji = args.getString("emoji");
    let Option = args.getNumber("option");
    if (!Option || Option > 6 || isNaN(Option)) Option = 1;
    const data: iReaction = {
      Channel,
      Message,
      Role,
      Emoji,
      Option
    };
    const FindChannel = interaction.guild.channels.cache.get(
      Channel
    ) as TextBasedChannel;
    const FindMessage = await FindChannel.messages.fetch(Message);
    const Deleted = await react.Delete(interaction.guild, data);

    if (Deleted.status === "Deleted") {
      InteractionTools.reply(
        interaction,
        await ReactionRoleRemovedEmbed(
          client,
          interaction,
          interaction.user,
          FindMessage
        ),
        false
      );
      FindMessage.reactions.cache.get(Emoji).remove();
    } else {
      InteractionTools.reply(
        interaction,
        await UnableToDeleteReactionRoleEmbed(
          client,
          interaction,
          interaction.user,
          FindMessage
        ),
        false
      );
    }
  }
}
