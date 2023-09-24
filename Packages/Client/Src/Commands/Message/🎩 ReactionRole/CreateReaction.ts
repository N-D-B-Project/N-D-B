import ReactionRole from "@/Modules/ReactionRole";
import { iReaction } from "@/Modules/ReactionRole/Types";
import {
  InvalidChannelEmbed,
  InvalidEmojiEmbed,
  InvalidIDEmbed,
  InvalidRoleEmbed,
  MessageNotFoundEmbed,
  ReactionRoleCreatedEmbed,
  UnableToCreateReactionRoleEmbed
} from "@/Modules/ReactionRole/Utils/Embeds";
import { CommandOptions, INDBClient } from "@/Types";
import { BaseCommand } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { Message, TextChannel } from "discord.js";

export default class CreateReactionCommand extends BaseCommand {
  constructor(client: INDBClient, ...args: string[]) {
    const options: CommandOptions = {
      name: "CreateReaction",
      aliases: [
        "CReaction",
        "AddReaction",
        "createreaction",
        "creaction",
        "ReactionCreate"
      ],
      description: "Cria um novo Reaction Role no servidor.",
      category: "🎩 ReactionRole",
      usage:
        "<Canal> <MessageID> <Cargo> <Emoji> (opção)\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (option)",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "AddReactions", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"]
      },
      minArgs: 4,
      maxArgs: 5,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false
    };
    super(client, options, args);
  }
  async run(client: INDBClient, message: Message, args: Array<string>) {
    const reaction = new ReactionRole(client, "Create");
    let Channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      (message.guild.channels.cache.find(
        ch => ch.name === args[0]
      ) as TextChannel);
    Channel = Channel as TextChannel;
    if (!Channel) {
      MessageTools.send(
        message.channel,
        await InvalidChannelEmbed(client, message, message.author)
      );
      return;
    }

    if (!args[1]) {
      MessageTools.send(
        message.channel,
        await InvalidIDEmbed(client, message, message.author)
      );
      return;
    }

    const MsgID = await Channel.messages.fetch(args[1]).catch(async () => {
      MessageTools.send(
        message.channel,
        await MessageNotFoundEmbed(client, message, message.author)
      );
      return;
    });

    const Role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find(rl => rl.name === args[2]);
    if (!Role || Role.managed) {
      MessageTools.send(
        message.channel,
        await InvalidRoleEmbed(client, message, message.author)
      );
      return;
    }

    //Emoji
    if (!args[3]) {
      MessageTools.send(
        message.channel,
        await InvalidEmojiEmbed(client, message, message.author)
      );
    }

    let option = Number(args[4]);
    if (!option || option > 6 || isNaN(option)) option = 1;

    const data: iReaction = {
      Channel: Channel.id,
      Message: (MsgID as Message).id,
      Role: Role.id,
      Emoji: args[3].toString(),
      Option: option
    };
    const Created = await reaction.Create(message.guild, data);

    if (Created.status === "Created") {
      await MessageTools.send(
        message.channel,
        await ReactionRoleCreatedEmbed(client, message, data)
      );
      await MessageTools.react(MsgID as Message, args[3]);
      return;
    } else if (Created.status === "UnableToCreate") {
      await MessageTools.send(
        message.channel,
        await UnableToCreateReactionRoleEmbed(client, message, message.author)
      );
      return;
    }
  }
}
