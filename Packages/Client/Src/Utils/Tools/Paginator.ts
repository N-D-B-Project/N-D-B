/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { INDBClient } from "@/Types";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CollectorFilter,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Interaction,
  InteractionCollector,
  Message
} from "discord.js";
import { InteractionTools, MessageTools } from "./";

export default async function Paginator(
  client: INDBClient,
  msgint: Message | Interaction,
  type: "Message" | "Interaction" | "DM",
  embeds: Array<EmbedBuilder>,
  time: number = 60000
): Promise<void> {
  let CurrentPage: typeof msgint;
  let Collector: InteractionCollector<ButtonInteraction>;
  let filter: CollectorFilter<any[]>;
  let index: number = 0;
  const Embed = embeds[index];
  const PreviousButton = new ButtonBuilder()
    .setCustomId("PREVIOUS")
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(index === 0);
  const HomeButton = new ButtonBuilder()
    .setCustomId("HOME")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🏡")
    .setDisabled(index === 0);
  const NextButton = new ButtonBuilder()
    .setCustomId("NEXT")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("➡️")
    .setDisabled(index === embeds.length - 1);

  const Row = new ActionRowBuilder<ButtonBuilder>().setComponents([
    PreviousButton,
    HomeButton,
    NextButton
  ]);

  if (type === "Message") {
    await Message();
  } else if (type === "Interaction") {
    await Interaction();
  } else if (type === "DM") {
    await DM();
  }

  async function Message() {
    filter = u => u.id === (msgint as Message).author.id;

    if (embeds.length === 1) {
      CurrentPage = await MessageTools.send(msgint.channel, {
        embeds,
        components: []
      });

      return;
    }

    CurrentPage = await MessageTools.send(msgint.channel, {
      embeds: [
        Embed.setFooter({
          text: await client.Translate.Guild(
            "Tools/Tools:Pagination:Embed:Footer",
            msgint as Message,
            {
              Current: index + 1,
              Total: embeds.length
            }
          )
        })
      ],
      components: [Row]
    });

    Collector = CurrentPage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time
    })
      .on("collect", async (interation: ButtonInteraction) => {
        const ID = interation.customId;

        if (ID === "PREVIOUS") {
          if (index > 0) index--;
        }
        if (ID === "HOME") {
          index = 0;
        }
        if (ID === "NEXT") {
          if (index < embeds.length - 1) index++;
        }

        if (index === 0) PreviousButton.setDisabled(true);
        else PreviousButton.setDisabled(false);
        if (index === 0) HomeButton.setDisabled(true);
        else HomeButton.setDisabled(false);
        if (index === embeds.length - 1) NextButton.setDisabled(true);
        else NextButton.setDisabled(false);

        await MessageTools.edit(CurrentPage as Message, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.Guild(
                "Tools/Tools:Pagination:Embed:Footer",
                msgint as Message,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: [Row]
        });

        Collector.resetTimer();
      })
      .on("end", async (interaction: ButtonInteraction) => {
        await MessageTools.edit(CurrentPage as Message, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.Guild(
                "Tools/Tools:Pagination:Embed:Footer",
                msgint as Message,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: []
        });
      });
  }

  async function Interaction() {
    filter = u => u.id === (msgint as Interaction).user.id;

    if (embeds.length === 1) {
      CurrentPage = await InteractionTools.reply(
        msgint as CommandInteraction,
        {
          embeds,
          components: []
        },
        false
      );

      return;
    }

    CurrentPage = await InteractionTools.reply(
      msgint as CommandInteraction,
      {
        embeds: [
          Embed.setFooter({
            text: await client.Translate.Guild(
              "Tools/Tools:Pagination:Embed:Footer",
              msgint as Message,
              {
                Current: index + 1,
                Total: embeds.length
              }
            )
          })
        ],
        components: [Row]
      },
      false
    );

    Collector = CurrentPage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time
    })
      .on("collect", async (interation: ButtonInteraction) => {
        const ID = interation.customId;

        if (ID === "PREVIOUS") {
          if (index > 0) index--;
        }
        if (ID === "HOME") {
          index = 0;
        }
        if (ID === "NEXT") {
          if (index < embeds.length - 1) index++;
        }

        if (index === 0) PreviousButton.setDisabled(true);
        else PreviousButton.setDisabled(false);
        if (index === 0) HomeButton.setDisabled(true);
        else HomeButton.setDisabled(false);
        if (index === embeds.length - 1) NextButton.setDisabled(true);
        else NextButton.setDisabled(false);

        await InteractionTools.editReply(msgint as CommandInteraction, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.Guild(
                "Tools/Tools:Pagination:Embed:Footer",
                msgint as Message,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: [Row]
        });

        Collector.resetTimer();
      })
      .on("end", async (interaction: ButtonInteraction) => {
        await InteractionTools.editReply(msgint as CommandInteraction, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.Guild(
                "Tools/Tools:Pagination:Embed:Footer",
                msgint as Message,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: [Row]
        });
      });
  }

  async function DM() {
    filter = u => u.id === (msgint as Message).author.id;

    if (embeds.length === 1) {
      CurrentPage = await MessageTools.send(msgint.channel, {
        embeds,
        components: []
      });

      return;
    }

    CurrentPage = await MessageTools.send(msgint.channel, {
      embeds: [
        Embed.setFooter({
          text: await client.Translate.DM(
            "Tools/Tools:Pagination:Embed:Footer",
            (msgint as Message).author,
            {
              Current: index + 1,
              Total: embeds.length
            }
          )
        })
      ],
      components: [Row]
    });

    Collector = CurrentPage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time
    })
      .on("collect", async (interation: ButtonInteraction) => {
        const ID = interation.customId;

        if (ID === "PREVIOUS") {
          if (index > 0) index--;
        }
        if (ID === "HOME") {
          index = 0;
        }
        if (ID === "NEXT") {
          if (index < embeds.length - 1) index++;
        }

        if (index === 0) PreviousButton.setDisabled(true);
        else PreviousButton.setDisabled(false);
        if (index === 0) HomeButton.setDisabled(true);
        else HomeButton.setDisabled(false);
        if (index === embeds.length - 1) NextButton.setDisabled(true);
        else NextButton.setDisabled(false);

        await MessageTools.edit(CurrentPage as Message, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.DM(
                "Tools/Tools:Pagination:Embed:Footer",
                (msgint as Message).author,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: [Row]
        });

        Collector.resetTimer();
      })
      .on("end", async (interaction: ButtonInteraction) => {
        await MessageTools.edit(CurrentPage as Message, {
          embeds: [
            Embed.setFooter({
              text: await client.Translate.DM(
                "Tools/Tools:Pagination:Embed:Footer",
                (msgint as Message).author,
                {
                  Current: index + 1,
                  Total: embeds.length
                }
              )
            })
          ],
          components: []
        });
      });
  }
}
