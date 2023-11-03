import { Context } from "@/Utils/Structures";
import { Paginator } from "@/Utils/Tools";
import { APIEmbed, EmbedBuilder, GuildMember, Message } from "discord.js";
import MusicTools from "./Tools";

export default class Queue {
  public static async run(context: Context): Promise<Message> {
    if (!(await MusicTools.Checkers(context))) return;

    const player = await MusicTools.getPlayer(context);
    const queue: typeof player.queue.tracks = [player.queue.current];
    queue.push(...player.queue.tracks);
    const embeds: Array<APIEmbed> = [];

    for (let i = 0; i < queue.length; i++) {
      const track = queue[i];
      const Requester = (
        (await (
          await context.client.guilds.fetch(player.guildId)
        ).members.fetch(track.requester as string)) as GuildMember
      ).user;

      const Timer = await context.client.Tools.Timer(
        "normal",
        track.info.duration,
        context
      );
      embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: context.client.user.username,
            iconURL: context.client.user.displayAvatarURL()
          })
          .setTitle(
            await context.client.Translate.Guild(
              "Events/PlayerEvents:trackStart:Embed:Title",
              context,
              { TITLE: track.info.title }
            )
          )
          .setThumbnail(track.info.artworkUrl)
          .addFields([
            {
              name: await context.client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:1",
                context,
                {
                  EMOJI: (await MusicTools.URLChecker(false, track.info.uri))
                    .Emoji
                }
              ),
              value: `> ${await context.client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:1",
                context,
                {
                  Platform: MusicTools.formatSourceName(track.info.sourceName),
                  URI: track.info.uri
                }
              )}`,
              inline: true
            },
            {
              name: await context.client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:2",
                context
              ),
              value: `> ${await context.client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:2",
                context,
                { AUTHOR: track.info.author }
              )}`,
              inline: true
            },
            {
              name: await context.client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:3",
                context
              ),
              value: `> ${
                track.info.isStream
                  ? await context.client.Translate.Guild(
                      "Events/PlayerEvents:trackStart:Embed:Fields:Content:3²",
                      context
                    )
                  : await context.client.Translate.Guild(
                      "Events/PlayerEvents:trackStart:Embed:Fields:Content:3",
                      context,
                      { TIMER: Timer }
                    )
              }`,
              inline: true
            }
          ])
          .setColor("#00c26f")
          .setFooter({
            text: await context.client.Translate.Guild(
              "Events/PlayerEvents:trackStart:Embed:Footer",
              context,
              { REQUESTER: Requester.username }
            ),
            iconURL: Requester.displayAvatarURL()
          })
          .setTimestamp()
          .toJSON()
      );
    }

    return await Paginator(context, embeds);
  }
}
