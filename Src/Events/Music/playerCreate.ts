import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js"; 
import * as Erela from "erela.js"
import { platform } from "os";

export default class playerCreateEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "playerCreate",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, player: Erela.Player) {
    const guild = client.guilds.cache.get(player.guild) as Discord.Guild;
    client.logger.info(`Player iniciando no servidor: ${guild.name}(${guild.id})`)
    var TextChannel = client.channels.cache.get(player.textChannel) as Discord.TextChannel;
    var VoiceChannel = client.channels.cache.get(player.voiceChannel) as Discord.VoiceChannel;
    player.setVolume(50);
    const embed = new Discord.MessageEmbed()
      .setAuthor({ 
        name: guild.name,
        iconURL: guild.iconURL({ dynamic: true })
      })
      .setColor("#00c26f")
      .setTitle(await client.translate("Events/PlayerEvents:playerCreate:Embed:Title", TextChannel))
      .setDescription(await client.translate("Events/PlayerEvents:playerCreate:Embed:Description", TextChannel, { TEXT: TextChannel.id, VOICE: VoiceChannel.name}))
      .setFooter({
        text: await client.translate("Events/PlayerEvents:playerCreate:Embed:Footer", TextChannel),
        iconURL: client.user.displayAvatarURL()
      })
      .setTimestamp();
    const PlayerMessage = await TextChannel.send({ embeds: [embed] });
    player.SetPlayerMessage(PlayerMessage);

    const DeletePlayerMessage = TextChannel.messages.fetch(player.PlayerMessage).then((msg) => {
      if(msg && msg.deletable) {
        setTimeout(async () => {
          msg.delete().catch((error: Error) => { client.logger.warn("Não consegui deletar o \"Player_MESSAGE\"")})
        }, 10 * 1000)
      }
    });

    if (client.Config.Music.Client.serverDeaf) {
      for (var i = 0; i <= 5; i++) {
        await new Promise((res) => {
          setTimeout(() => {
            res(2)
            var Guild = client.guilds.cache.get(player.guild) as Discord.Guild;
            Guild.me.voice.setDeaf(true)
            i = 10;
          }, 1000)
        });
      }
    }
  }
}
