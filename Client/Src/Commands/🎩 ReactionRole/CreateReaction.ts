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
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextChannel,
} from "discord.js";

export default class Command extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "CreateReaction",
      aliases: ["CReaction", "AddReaction", "createreaction", "creaction"],
      description: "Cria um novo Reaction Role no servidor.",
      category: "🎩 ReactionRole",
      usage:
        "<Canal> <MessageID> <Cargo> <Emoji> (opção)\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (option)",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 4,
      maxArgs: 5,
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
    const react: ReactionRole = new ReactionRole(client, "Create");
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
    await MsgID.react(args[3]);

    let option = Number(args[4]);
    // if (!option) option = 1;
    if (!option || option > 6 || isNaN(option)) option = 1;
    // if (option > 6) option = 1;

    const CREATE = await react.reactionCreate(
      "Message",
      message,
      Channel.id,
      message.guildId,
      args[1],
      Role.id,
      args[3],
      option
    );
    if (CREATE) {
      TMessage.send(message.channel, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: await client.translate(
                "🎩 ReactionRole/CreateReaction:Embed:Author",
                message
              ),
              iconURL: message.guild.iconURL(),
            })
            .setColor("#00c26f")
            .addFields([
              {
                name: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:1",
                  message
                ),
                value: `<#${Channel.id}>`,
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:2",
                  message
                ),
                value: args[3],
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:3",
                  message
                ),
                value: String(option),
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:4",
                  message
                ),
                value: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:Content:4",
                  message,
                  { MsgIdURL: MsgID.url }
                ),
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/CreateReaction:Embed:Fields:5",
                  message
                ),
                value: `<@&${Role.id}>`,
              },
            ]),
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
