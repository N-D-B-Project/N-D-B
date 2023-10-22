import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  InteractionCollector,
  Message
} from "discord.js";
import { Context } from "../Structures";

export default async function Paginator(
  context: Context,
  embeds: Array<EmbedBuilder>,
  time: number = 60000
): Promise<Message | void> {
  let CurrentPage: Message;
  let index: number = 0;
  let Embed = embeds[index];
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

  const Row = new ActionRowBuilder<ButtonBuilder>().addComponents([
    PreviousButton,
    HomeButton,
    NextButton
  ]);

  if (embeds.length === 1) {
    return (CurrentPage = await context.send({
      embeds,
      components: []
    }));
  }

  CurrentPage = await context.send({
    embeds: [
      Embed.setFooter({
        text: await context.client.Translate.TFunction(
          context,
          "Tools/Tools:Pagination:Embed:Footer",
          {
            Current: index + 1,
            Total: embeds.length
          }
        )
      })
    ],
    components: [Row]
  });

  const Collector: InteractionCollector<ButtonInteraction> =
    CurrentPage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time,
      filter: i => i.user.id === context.author.id
    })
      .on("collect", async (interaction: ButtonInteraction) => {
        const ID = interaction.customId;

        if (ID === "PREVIOUS") {
          if (index > 0) index--;
        }
        if (ID === "HOME") {
          index = 0;
        }
        if (ID === "NEXT") {
          if (index < embeds.length - 1) index++;
        }

        await context.client.Tools.WAIT(100);

        if (index === 0) PreviousButton.setDisabled(true);
        else PreviousButton.setDisabled(false);
        if (index === 0) HomeButton.setDisabled(true);
        else HomeButton.setDisabled(false);
        if (index === embeds.length - 1) NextButton.setDisabled(true);
        else NextButton.setDisabled(false);
        Embed = embeds[index];
        await context.edit({
          embeds: [
            Embed.setFooter({
              text: await context.client.Translate.TFunction(
                context,
                "Tools/Tools:Pagination:Embed:Footer",
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
      .on("end", async () => {
        CurrentPage = await context.edit({
          embeds: [
            Embed.setFooter({
              text: await context.client.Translate.TFunction(
                context,
                "Tools/Tools:Pagination:Embed:Footer",
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
