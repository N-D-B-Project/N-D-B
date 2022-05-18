import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import {
  MessageTools as Message,
  InteractionTools as Interaction,
} from "@Utils/Tools";
import { Emojis } from "~/Config/Emojis";
import ReactionRole from "~/Packages/ReactionRole";
import BaseCommand from "@Structures/BaseCommand";
import * as Discord from "discord.js";

export default class ReactionEditCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReactionEdit",
      aliases: ["REdit", "reactionedit"],
      description: "Edita uma Reaction Role",
      category: "🎩 ReactionRole",
      usage:
        "<Channel> <MessageId> <Cargo> <NovoCargo> <Emoji> (opção)\nDica Utilize o comando **ReactionTypes** para ver os parâmetros para (option)",
      disable: false,
      cooldown: 0,
      userPerms: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS", "MANAGE_ROLES"],
      botPerms: ["EMBED_LINKS", "ADD_REACTIONS"],
      minArgs: 6,
      maxArgs: 7,
      guildOnly: false,
      ownerOnly: false,
      nsfw: false,
      ndcash: 0,
      DM: false,
      // SlashOptions: {
      //   name: "",
      //   ephemeral: "",
      //   description: "",
      // },
    };
    super(client, options, args);
  }

  async run(client: NDBClient, message: Discord.Message, args: Array<string>) {
    const react: ReactionRole = new ReactionRole(client, "Edit");
    var Channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      (message.guild.channels.cache.find(
        (ch) => ch.name === args[0]
      ) as Discord.TextChannel);
    Channel = Channel as Discord.TextChannel;
    if (!Channel) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:Channel:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    if (!args[1]) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:ID:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }
    var MsgID = await Channel.messages.fetch(args[1]).catch(async () => {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:ID:NotFound",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    });
    MsgID = MsgID as Discord.Message;

    var Role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);
    var NewRole =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[3]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[3]);
    if (!Role || Role.managed) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:Role:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }
    if (!NewRole || NewRole.managed) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:Role:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    if (!args[4] || (await this.isCustomEmoji(args[4]))) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: message.author.id,
              iconURL: message.author.displayAvatarURL(),
            })
            .setColor("#c20e00")
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/EditReaction:Emoji:Invalid",
                message,
                { fail: Emojis.fail }
              )
            ),
        ],
      });
      return;
    }

    let option = Number(args[5]);
    if (!option) option = 1;
    if (isNaN(option)) option = 1;
    if (option > 6) option = 1;

    const EDIT = await react.reactionEdit(
      message.guild,
      Channel.id,
      message.guildId,
      args[1],
      Role.id,
      args[3],
      String(option)
    );

    if (EDIT) {
      Message.send(message.channel, {
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor({
              name: await client.translate(
                "🎩 ReactionRole/EditReaction:Embed:Author",
                message
              ),
              iconURL: message.guild.iconURL(),
            })
            .setColor("#00c26f")
            .addFields(
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:1",
                  message
                ),
                value: `<#${Channel.id}>`,
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:2",
                  message
                ),
                value: args[3],
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:3",
                  message
                ),
                value: String(option),
                inline: true,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:4",
                  message
                ),
                value: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:Content:4",
                  message,
                  { MsgIdURL: MsgID.url }
                ),
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:5",
                  message
                ),
                value: `<@&${Role.id}>`,
              },
              {
                name: await client.translate(
                  "🎩 ReactionRole/EditReaction:Embed:Fields:6",
                  message
                ),
                value: `<@&${NewRole.id}>`,
              }
            ),
        ],
      });
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: Discord.CommandInteraction,
    args: Discord.CommandInteractionOptionResolver
  ) {}

  async isCustomEmoji(emoji: string) {
    return emoji.split(":").length == 1 ? false : true;
  }
}
