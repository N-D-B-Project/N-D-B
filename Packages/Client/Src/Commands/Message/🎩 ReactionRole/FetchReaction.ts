import NDBClient from "@Client/NDBClient";
import { CommandOptions } from "~/Types";
import {
  MessageTools as TMessage,
  InteractionTools as TInteraction,
  Buttons,
} from "@Utils/Tools";
import { ReactionRole } from "~/Packages";
import { Emojis } from "~/Config/Config";
import { BaseCommand } from "@Utils/Structures";
import {
  Message,
  EmbedBuilder,
  TextChannel,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Interaction,
  MessageComponentInteraction,
  ComponentType,
} from "discord.js";

export default class ReactionFetchCommand extends BaseCommand {
  constructor(client: NDBClient, ...args: any[]) {
    const options: CommandOptions = {
      name: "ReactionFetch",
      aliases: ["RFetch", "ReactionList", "RList", "reactionlist", "rlist"],
      description:
        "Mostra uma lista contendo todas as Reaction Roles do servidor.",
      category: "🎩 ReactionRole",
      usage: "<Channel | All> (channel)",
      disable: false,
      cooldown: 0,
      permissions: {
        user: ["SendMessages", "UseApplicationCommands", "ManageRoles"],
        bot: ["EmbedLinks", "AddReactions", "ManageRoles"],
      },
      minArgs: 1,
      maxArgs: 2,
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

  async run(client: NDBClient, message: Message, args: Array<string>) {
    message.channel.send("Command not implemented yet.");
    // return;

    switch (args[0]) {
      case "Channel":
        var Channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[1]) ||
          (message.guild.channels.cache.find(
            (ch) => ch.name === args[1]
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
                  await client.Translate.Guild(
                    "🎩 ReactionRole/CreateReaction:Channel:Invalid",
                    message,
                    { fail: Emojis.fail }
                  )
                ),
            ],
          });
          return;
        }

        break;
      case "All":
        break;
    }
  }

  async SlashRun(
    client: NDBClient,
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {}

  async Handler(
    client: NDBClient,
    type: "message" | "interaction",
    info: "Channel" | "All",
    msgint: Message | CommandInteraction,
    n: Message,
    channel?: TextChannel
  ) {
    const buttons = new Buttons(client);
    var CurrentPage = 1;
    const react: ReactionRole = new ReactionRole(client, "Fetch");
    switch (type) {
      case "message":
        msgint = msgint as Message;
        break;
      case "interaction":
        msgint = msgint as CommandInteraction;
    }
    const time = 1000 * 60 * 5;
    const filter = (i: Interaction) => i.user.id === msgint.member.user.id;
    const reactions = await react.reactionFetch(
      msgint.guild,
      channel.id,
      "Channel"
    );
    const embed = new EmbedBuilder()
      .setAuthor({
        name: msgint.guild.name,
        iconURL: msgint.guild.iconURL(),
      })
      .setDescription(
        `${reactions[CurrentPage - 1].channel}\n${
          reactions[CurrentPage - 1].message
        }\n${reactions[CurrentPage - 1].role}\n${
          reactions[CurrentPage - 1].emoji
        }\n${reactions[CurrentPage - 1].option}`
      )
      .setFooter({
        text: `${CurrentPage}/${reactions.length}`,
      });

    const msg = await TMessage.send(msgint.channel, {
      embeds: [embed],
      components: [
        (await buttons.Pages(msgint, CurrentPage, reactions.length)) as any,
      ],
    });

    const collector = msg.createMessageComponentCollector({
      filter,
      time,
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (i: MessageComponentInteraction) => {
      if (!i) {
        return;
      }

      if (i.customId !== "PREVIOUS" && i.customId !== "NEXT") {
        return;
      }

      if (i.customId === "PREVIOUS") {
        CurrentPage--;
      } else if (i.customId === "NEXT") {
        CurrentPage++;
      }

      if (msg) {
        await TMessage.edit(msg, {
          embeds: [
            embed
              .setDescription(
                `${reactions[CurrentPage - 1].channel}\n${
                  reactions[CurrentPage - 1].message
                }\n${reactions[CurrentPage - 1].role}\n${
                  reactions[CurrentPage - 1].emoji
                }\n${reactions[CurrentPage - 1].option}`
              )
              .setFooter({
                text: `${CurrentPage}/${reactions.length}`,
              }),
          ],
          components: [
            (await buttons.Pages(msgint, CurrentPage, reactions.length)) as any,
          ],
        });
      }
    });
  }
}
