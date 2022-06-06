import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import BaseCommand from "@Structures/BaseCommand";
import {
  MessageTools as TMessage,
  InteractionTools as TInteraction,
} from "@Utils/Tools";
import { Emojis } from "~/Config/Emojis";
import ReactionRole from "~/Packages/ReactionRole";
import {
  Message,
  TextChannel,
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";

export default class DeleteReactionCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "DeleteReaction",
      aliases: [
        "DReaction",
        "RemoveReaction",
        "removereaction",
        "dreaction",
        "rreaction",
      ],
      description: "Deleta uma Reaction Role existente",
      category: "🎩 ReactionRole",
      usage: "<Canal> <MessageID> <Cargo> <Emoji>",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 4,
      maxArgs: 4,
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
    const react: ReactionRole = new ReactionRole(client, "Delete");
    var Channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      (message.guild.channels.cache.find(
        (ch) => ch.name === args[0]
      ) as TextChannel);
    Channel = Channel as TextChannel;
    if (!Channel) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:Channel:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    if (!args[1]) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:ID:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }
    var MsgID = await Channel.messages.fetch(args[1]).catch(async () => {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:ID:NotFound",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    });
    MsgID = MsgID as Message;

    var Role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);
    if (!Role || Role.managed) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:Role:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    if (!args[3] || (await this.isCustomEmoji(args[3]))) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/CreateReaction:Emoji:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    const REACT = await react.reactionDelete(
      message.guild,
      MsgID.id,
      Channel.id,
      Role.id,
      args[3]
    );

    if (REACT) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/DeleteReaction:Removed",
                message,
                { success: Emojis.success, URL: MsgID.url }
              )
            ),
        ],
      });
    } else {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/DeleteReaction:UnableToDelete",
                message,
                { success: Emojis.success, URL: MsgID.url }
              )
            ),
        ],
      });
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}

  async isCustomEmoji(emoji: string) {
    return emoji.split(":").length == 1 ? false : true;
  }
}
