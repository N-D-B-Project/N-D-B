import NDBClient from "@/Core/NDBClient";
import ReactionRole from "@/Modules/ReactionRole";
import { iReaction } from "@/Modules/ReactionRole/Types";
import {
  ReactionRoleCreatedEmbed,
  UnableToCreateReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { SubCommandOptions } from "@/Types";
import { BaseSubCommand } from "@/Utils/Structures";
import { InteractionTools } from "@/Utils/Tools";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextBasedChannel
} from "discord.js";

export default class CreateReactionSubCommand extends BaseSubCommand {
  constructor(client: NDBClient, args: CommandInteractionOptionResolver) {
    const options: SubCommandOptions = {
      name: "create",
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
    const react: ReactionRole = new ReactionRole(client, "(/)Create");

    const Channel = args.getChannel("channel").id;
    const Message = args.getString("message");
    const Role = args.getRole("role").id;
    const Emoji = args.getString("emoji");
    var Option = args.getNumber("option");
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

    const Created = await react.Create(interaction.guild, data);
    if (Created.status === "Created") {
      await InteractionTools.reply(
        interaction,
        await ReactionRoleCreatedEmbed(client, interaction, data),
        false
      );
      await FindMessage.react(Emoji);
      return;
    } else if (Created.status === "UnableToCreate") {
      await InteractionTools.reply(
        interaction,
        await UnableToCreateReactionRoleEmbed(
          client,
          interaction,
          interaction.user
        ),
        false
      );
      return;
    }
  }
}
