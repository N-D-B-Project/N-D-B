/* eslint-disable @typescript-eslint/no-unused-vars */
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import {
  EmbedBuilder,
  GuildChannel,
  GuildMember,
  Message,
  TextChannel
} from "discord.js";
import { Player, Track, TrackStartEvent } from "erela.js";

export default class trackStartEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackStart",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: NDBClient,
    player: Player,
    track: Track,
    payload: TrackStartEvent
  ) {
    var textChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;

    const Requester = (
      (await (
        await client.guilds.fetch(player.guild)
      ).members.fetch(track.requester as string)) as GuildMember
    ).user;

    const Timer = await client.Tools.Timer(
      "normal",
      track.duration,
      textChannel as GuildChannel
    );
    await client.Tools.WAIT(500);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL()
      })
      .setColor("#00c26f")
      .setTitle(
        await client.Translate.Guild(
          "Events/PlayerEvents:trackStart:Embed:Title",
          textChannel
        )
      )
      .addFields([
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:trackStart:Embed:Fields:1",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:trackStart:Embed:Fields:Content:1",
            textChannel,
            { TITLE: track.title, URI: track.uri }
          ),
          inline: true
        },
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:trackStart:Embed:Fields:2",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:trackStart:Embed:Fields:Content:2",
            textChannel,
            { AUTHOR: track.author }
          ),
          inline: true
        },
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:trackStart:Embed:Fields:3",
            textChannel
          ),
          value: track.isStream
            ? await client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:3²",
                textChannel
              )
            : await client.Translate.Guild(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:3",
                textChannel,
                { TIMER: Timer }
              ),
          inline: true
        }
      ])
      .setThumbnail(track.artworkUrl)
      .setFooter({
        text: await client.Translate.Guild(
          "Events/PlayerEvents:trackStart:Embed:Footer",
          textChannel,
          { REQUESTER: Requester.username }
        ),
        iconURL: Requester.displayAvatarURL()
      })
      .setTimestamp();
    MessageTools.send(textChannel, { embeds: [embed] }).then(msg => {
      try {
        const CURRENT_SONG_MSG = textChannel.messages.cache.get(
          player.songMessage
        ) as Message;
        if (CURRENT_SONG_MSG && msg.id !== CURRENT_SONG_MSG.id) {
          CURRENT_SONG_MSG.delete().catch((error: Error) => {
            client.logger.warn(
              // eslint-disable-next-line quotes
              'Não consegui deletar a "CURRENT_SONG_MSG"',
              error
            );
          });
        }
      } catch {}
      player.songMessage = msg.id;
    });
  }
}
