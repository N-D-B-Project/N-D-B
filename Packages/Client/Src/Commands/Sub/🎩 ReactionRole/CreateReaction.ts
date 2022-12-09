import NDBClient from "@Client/NDBClient";
import { eCommandType, SubCommandOptions } from "~/Types";
import { BaseSubCommand } from "@Utils/Structures";
import { InteractionTools } from "@Utils/Tools";
import ReactionRole from "~/Packages/ReactionRole";
import {
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextBasedChannel,
  Interaction,
} from "discord.js";

export default class CreateReactionSubCommand extends BaseSubCommand {
  constructor(client: NDBClient, ...args: any) {
    const options: SubCommandOptions = {
      name: "create",
      category: "🎩 ReactionRole",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
    };
    super(client, options, args);
  }

  async run(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    console.log("CreateReaction");
    const react: ReactionRole = new ReactionRole(client, "(/)Create");

    const Channel = args.getChannel("channel");
    const Message = args.getString("message");
    const Role = args.getRole("role");
    const Emoji = args.getString("emoji");
    var option = args.getNumber("option");
    if (!option || option > 6 || option === null) option = 1;

    const FindChannel = interaction.guild.channels.cache.get(
      Channel.id
    ) as TextBasedChannel;
    const FindMessage = await FindChannel.messages.fetch(Message);

    const CREATE = await react.Create(
      eCommandType.INTERACTION,
      interaction as Interaction,
      Channel.id,
      interaction.guildId,
      Message,
      Role.id,
      Emoji,
      option
    );
    if (CREATE) {
      try {
        await InteractionTools.reply(
          interaction,
          {
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: await client.Translate.Guild(
                    "🎩 ReactionRole/CreateReaction:Embed:Author",
                    interaction
                  ),
                  iconURL: interaction.guild.iconURL(),
                })
                .setColor("#00c26f")
                .addFields(
                  {
                    name: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:1",
                      interaction
                    ),
                    value: `${Channel}`,
                    inline: true,
                  },
                  {
                    name: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:2",
                      interaction
                    ),
                    value: Emoji,
                    inline: true,
                  },
                  {
                    name: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:3",
                      interaction
                    ),
                    value: String(option),
                    inline: true,
                  },
                  {
                    name: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:4",
                      interaction
                    ),
                    value: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:Content:4",
                      interaction,
                      {
                        MsgIdURL: `${FindMessage.url}`,
                      }
                    ),
                  },
                  {
                    name: await client.Translate.Guild(
                      "🎩 ReactionRole/CreateReaction:Embed:Fields:5",
                      interaction
                    ),
                    value: `${Role}`,
                  }
                ),
            ],
          },
          false
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  }
}
