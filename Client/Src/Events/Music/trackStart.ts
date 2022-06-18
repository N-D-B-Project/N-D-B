import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import { User, EmbedBuilder, Message, TextChannel } from "discord.js";
import { Player, Track } from "erela.js";

export default class trackStartEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackStart",
      type: "on",
      emitter: "music",
    };

    super(client, options);
  }

  async run(client: NDBClient, player: Player, track: Track) {
    var TextChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;
    const Requester = client.users.cache.get(String(track.requester)) as User;
    const Timer = client.Tools.Timer("normal", track.duration, TextChannel);
    player.AddLastSong(track);

    await client.Tools.WAIT(500);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: client.user.tag,
        url: client.user.displayAvatarURL(),
      })
      .setColor("#00c26f")
      .setTitle(
        await client.translate(
          "Events/PlayerEvents:trackStart:Embed:Title",
          TextChannel
        )
      )
      .addFields([
        {
          name: await client.translate(
            "Events/PlayerEvents:trackStart:Embed:Fields:1",
            TextChannel
          ),
          value: await client.translate(
            "Events/PlayerEvents:trackStart:Embed:Fields:Content:1",
            TextChannel,
            { TITLE: track.title, URI: track.uri }
          ),
          inline: true,
        },
        {
          name: await client.translate(
            "Events/PlayerEvents:trackStart:Embed:Fields:2",
            TextChannel
          ),
          value: await client.translate(
            "Events/PlayerEvents:trackStart:Embed:Fields:Content:2",
            TextChannel,
            { AUTHOR: track.author }
          ),
          inline: true,
        },
        {
          name: await client.translate(
            "Events/PlayerEvents:trackStart:Embed:Fields:3",
            TextChannel
          ),
          value: track.isStream
            ? await client.translate(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:3²",
                TextChannel
              )
            : await client.translate(
                "Events/PlayerEvents:trackStart:Embed:Fields:Content:3",
                TextChannel,
                { TIMER: Timer }
              ),
          inline: true,
        },
      ])
      .setThumbnail(track.thumbnail)
      .setFooter({
        text: await client.translate(
          "Events/PlayerEvents:trackStart:Embed:Footer",
          TextChannel,
          { REQUESTER: Requester.tag }
        ),
        iconURL: Requester.displayAvatarURL(),
      })
      .setTimestamp();
    TextChannel.send({ embeds: [embed] }).then((msg) => {
      try {
        const CURRENT_SONG_MSG = TextChannel.messages.cache.get(
          player.SongMessage
        ) as Message;
        if (CURRENT_SONG_MSG && msg.id !== CURRENT_SONG_MSG.id) {
          CURRENT_SONG_MSG.delete().catch((error: Error) => {
            client.logger.warn('Não consegui deletar a "CURRENT_SONG_MSG"');
          });
        }
      } catch {}
      player.SetCurrentSongMessage(msg);
    });
  }
}
