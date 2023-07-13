import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"
import { EmbedBuilder, TextChannel, VoiceChannel } from "discord.js"
import { Player, Track, TrackEndEvent } from "erela.js"
import ms from "parse-ms"

export default class queueEndEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "queueEnd",
      type: "on",
      emitter: "music",
      enable: true
    }

    super(client, options)
  }

  async run(
    client: NDBClient,
    player: Player,
    track: Track,
    payload: TrackEndEvent
  ) {
    var TextChannel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel
    var VoiceChannel = client.channels.cache.get(
      player.voiceChannel
    ) as VoiceChannel
    if (Config.Music.Player.AutoLeaveEmpty.Queue.Enable) {
      setTimeout(async () => {
        try {
          player = client.ErelaManager.players.get(player.guild)
          if (!player.queue && player.queue.current) {
            const Timer = ms(Config.Music.Player.AutoLeaveEmpty.Queue.Delay)
            const embed = new EmbedBuilder()
              .setAuthor({
                name: client.user.tag,
                url: client.user.displayAvatarURL()
              })
              .setColor("#00c26f")
              .setTitle(
                await client.Translate.Guild(
                  "Events/PlayerEvents:playerMove:queueEnd:Title",
                  TextChannel
                )
              )
              .setDescription(
                await client.Translate.Guild(
                  "Events/PlayerEvents:playerMove:queueEnd:Description",
                  TextChannel,
                  { CHANNEL: VoiceChannel.name, Timer: Timer }
                )
              )
              .setFooter({
                text: await client.Translate.Guild(
                  "Events/PlayerEvents:playerMove:queueEnd:Footer",
                  TextChannel,
                  { TIMER: Timer }
                )
              })
              .setTimestamp()
            const Message = await TextChannel.send({ embeds: [embed] })

            const DeleteMessage = TextChannel.messages
              .fetch(Message.id)
              .then(msg => {
                if (msg && msg.deletable) {
                  setTimeout(async () => {
                    msg.delete().catch((error: Error) => {
                      client.logger.warn(
                        'Não consegui deletar o "Player_MESSAGE"'
                      )
                    })
                  }, 4000)
                }
              })
            player.destroy()
          }
        } catch (error) {
          client.logger.error("Queue End Error: ", String(error))
        }
      }, Config.Music.Player.AutoLeaveEmpty.Queue.Delay)
    }
  }
}
