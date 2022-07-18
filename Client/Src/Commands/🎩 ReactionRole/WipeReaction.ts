import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import {
  MessageTools,
  InteractionTools,
  Buttons as BClass,
} from "@Utils/Tools";
import { ReactionRole } from "~/Packages";
import { ReactionRole as Schema } from "@Database/Schemas";
import BaseCommand from "@Structures/BaseCommand";
import { Document } from "mongoose";
import {
  Message,
  EmbedBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ComponentType,
} from "discord.js";

export default class ReactionWipeCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReactionWipe:Embed",
      aliases: ["RWipe", "reactionwipe:Embed"],
      description: "Remove todas as Reaction Roles do servidor",
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
    const Buttons = new BClass(client);
    const react = new ReactionRole(client, "Wipe");
    const data: Document = await Schema.findOne({
      ID: message.guild.id,
    });
    const GET = await data.get("Reactions");

    const MSG = await MessageTools.send(message.channel, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({
              extension: "gif",
              size: 512,
            }),
          })
          .setTitle(
            await client.translate(
              "🎩 ReactionRole/ReactionWipe:Embed:Title",
              message
            )
          )
          .setDescription(
            await client.translate(
              "🎩 ReactionRole/ReactionWipe:Embed:DescriptionConfirm",
              message
            )
          )
          .setColor("#00c26f"),
      ],
      components: [(await Buttons.Confirm(message)) as any],
    });

    const REACTION = MSG.awaitMessageComponent({
      componentType: ComponentType.Button,
      time: 15 * 1000,
      filter: (m) => m.user.id === message.author.id,
    });

    if ((await REACTION).customId === "YES") {
      const REACT = await react.reactionWipe(message.guild);
      if (REACT) {
        MessageTools.edit(MSG, {
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({
                  extension: "gif",
                  size: 512,
                }),
              })
              .setTitle(
                await client.translate(
                  "🎩 ReactionRole/ReactionWipe:Embed:Title",
                  message
                )
              )
              .setDescription(
                await client.translate(
                  "🎩 ReactionRole/ReactionWipe:Embed:DescriptionSuccess",
                  message,
                  { NUMBER: GET.length }
                )
              )
              .setColor("#00c26f"),
          ],
          components: [],
        });
      } else {
        MessageTools.edit(MSG, {
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({
                  extension: "gif",
                  size: 512,
                }),
              })
              .setTitle(
                await client.translate(
                  "🎩 ReactionRole/ReactionWipe:Embed:Title",
                  message
                )
              )
              .setDescription(
                await client.translate(
                  "🎩 ReactionRole/ReactionWipe:Embed:DescriptionError",
                  message
                )
              )
              .setColor("#c20e00"),
          ],
          components: [],
        });
      }
    } else if ((await REACTION).customId === "NO") {
      MessageTools.edit(MSG, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.displayAvatarURL({
                extension: "gif",
                size: 512,
              }),
            })
            .setTitle(
              await client.translate(
                "🎩 ReactionRole/ReactionWipe:Embed:Title",
                message
              )
            )
            .setDescription(
              await client.translate(
                "🎩 ReactionRole/ReactionWipe:Embed:DescriptionCancel",
                message
              )
            )
            .setColor("#c20e00"),
        ],
        components: [],
      });
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}
}
