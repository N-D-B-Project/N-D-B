import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Erela from "erela.js";
import ms from 'parse-ms';

export default class queueEndEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "queueEnd",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, player: Erela.Player) {
    var TextChannel = client.channels.cache.get(player.textChannel) as Discord.TextChannel;
    var VoiceChannel = client.channels.cache.get(player.voiceChannel) as Discord.VoiceChannel;
    if(client.Config.Music.Player.AutoLeaveEmpty.Queue.Enable) {
      setTimeout(async () => {
        try {
          player = client.ErelaManager.players.get(player.guild)
          if(!player.queue && player.queue.current) {
            const Timer = ms(client.Config.Music.Player.AutoLeaveEmpty.Queue.Delay)
            const embed = new Discord.MessageEmbed()
            .setAuthor({ 
              name: client.user.tag, 
              url: client.user.displayAvatarURL() 
            })
            .setColor("#00c26f")
            .setTitle(await client.translate("Events/PlayerEvents:playerMove:queueEnd:Title", TextChannel))
            .setDescription(await client.translate("Events/PlayerEvents:playerMove:queueEnd:Description", TextChannel, { CHANNEL: VoiceChannel.name, Timer: Timer}))
            .setFooter(await client.translate("Events/PlayerEvents:playerMove:queueEnd:Footer", TextChannel, { TIMER: Timer}))
            .setTimestamp();
            const Message = await TextChannel.send({ embeds: [embed] });

            const DeleteMessage = TextChannel.messages.fetch(Message.id).then((msg) => {
              if(msg && msg.deletable) {
                setTimeout(async () => {
                  msg.delete().catch((error: Error) => { client.logger.warn("Não consegui deletar o \"Player_MESSAGE\"")})
                }, 4000)
              }
            })
            player.destroy();
          }
        } catch (error) {
          client.logger.error("Queue End Error: ", String(error))
        }
      }, client.Config.Music.Player.AutoLeaveEmpty.Queue.Delay)
    }
  }
}
