import { Config, Emojis } from "@/Config/Config";
import NDBClient from "@/Core/NDBClient";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import {
  EmbedBuilder,
  Guild,
  TextChannel,
  VoiceChannel,
  channelMention
} from "discord.js";
import { Player } from "lavalink-client";
export default class playerCreateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerCreate",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, player: Player) {
    const guild = (await client.guilds.fetch(player.guildId)) as Guild;
    client.logger.info(
      `Player iniciando no servidor: ${guild.name}(${guild.id})`
    );
    const textChannel = client.channels.cache.get(
      player.textChannelId
    ) as TextChannel;
    const voiceChannel = client.channels.cache.get(
      player.voiceChannelId
    ) as VoiceChannel;
    const embed = new EmbedBuilder()
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL()
      })
      .setColor("#00c26f")
      .setTitle(
        await client.Translate.Guild(
          "Events/PlayerEvents:playerCreate:Embed:Title",
          textChannel
        )
      )
      .setFields([
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:1",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:Content:1",
            textChannel,
            { TEXT: channelMention(textChannel.id) }
          ),
          inline: true
        },
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:2",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:Content:2",
            textChannel,
            { isPremium: player.isPremium ? Emojis.accept : Emojis.fail }
          ),
          inline: true
        },
        {
          name: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:3",
            textChannel
          ),
          value: await client.Translate.Guild(
            "Events/PlayerEvents:playerCreate:Embed:Fields:Content:3",
            textChannel,
            { VOICE: channelMention(voiceChannel.id) }
          )
        }
      ])
      .setFooter({
        text: await client.Translate.Guild(
          "Events/PlayerEvents:playerCreate:Embed:Footer",
          textChannel
        ),
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();
    player.playerMessage = (
      await MessageTools.send(textChannel, { embeds: [embed] })
    ).id;

    // textChannel.messages.fetch(player.playerMessage).then(msg => {
    //   if (msg && msg.deletable) {
    //     setTimeout(async () => {
    //       msg.delete().catch((error: Error) => {
    //         client.logger.warn(
    //           // eslint-disable-next-line quotes
    //           'Não consegui deletar o "Player_MESSAGE"',
    //           error
    //         );
    //       });
    //     }, 10 * 1000);
    //   }
    // });

    if (Config.Music.Client.serverDeaf) {
      for (let i = 0; i <= 5; i++) {
        await new Promise(res => {
          setTimeout(() => {
            res(2);
            guild.members.me.voice.setDeaf(true);
            i = 10;
          }, 1000);
        });
      }
    }
  }
}
