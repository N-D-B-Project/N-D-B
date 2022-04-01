import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";
import * as Erela from "erela.js"

export default class trackStuckEvent extends BaseEvent {

  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "trackStuck",
      type: "on",
      emitter: "music"
    }

    super(client, options);
  }

  async run(client: NDBClient, player: Erela.Player, track: Erela.Track, payload: Erela.Payload) {
    player.stop()
    var TextChannel = client.channels.cache.get(player.textChannel) as Discord.TextChannel;
      
    const embed = new Discord.MessageEmbed()
      .setAuthor({ 
        name: client.user.tag, 
        url: client.user.displayAvatarURL() 
      })
      .setColor("#00c26f")
      .setTitle(await client.translate("Events/PlayerEvents:trackStuck:Embed:Title", TextChannel, { EMOJI: client.Emojis.fail }))
      .setDescription(await client.translate("Events/PlayerEvents:trackStuck:Embed:Description", TextChannel, { TITLE: track.title, URI: track.uri }))
      .setThumbnail(track.thumbnail)
      .setFooter(await client.translate("Events/PlayerEvents:trackStuck:Embed:Footer", TextChannel))
      .setTimestamp();
    TextChannel.send({ embeds: [embed] })
  }
}
