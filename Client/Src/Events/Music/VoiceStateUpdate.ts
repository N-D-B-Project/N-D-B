import NDBClient from "@Client/NDBClient";
import { EventOptions } from "~/Types";
import BaseEvent from "@Structures/BaseEvent";
import * as Discord from "discord.js";

module.exports = class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const name = ""
    const options: EventOptions = {
      name: "voiceStateUpdate",
      type: "on",
      emitter: "client"
    }

    super(client, options);
  }

  async run(client: NDBClient, oldState: Discord.VoiceState, newState: Discord.VoiceState) {
    var player = client.ErelaManager.players.get(newState.guild.id);

    // Auto set Client as Speaker in Stage Channels 
    if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
      if(newState.guild.me.permissions.has(Discord.Permissions.FLAGS.SPEAK) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Discord.Permissions.FLAGS.SPEAK))) {
        newState.guild.me.voice.setSuppressed(false);
      }
    }

    // Auto Leave Client from Channels if is EMPTY or Everyone is MUTED
    if(oldState && (!newState.channelId || newState.channelId)) {
      if(player && oldState.channelId == player.voiceChannel) {
        if (!((!oldState.streaming && newState.streaming) || 
              (oldState.streaming && !newState.streaming) || 
              (!oldState.serverMute && newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || 
              (oldState.serverMute && !newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || 
              (!oldState.selfMute && newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || 
              (oldState.selfMute && !newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || 
              (!oldState.selfVideo && newState.selfVideo) || (oldState.selfVideo && !newState.selfVideo))) {
                if(client.Config.Music.Player.AutoLeaveEmpty.Channel.Enable && player && (!oldState.channel.members || oldState.channel.members.size == 0 || oldState.channel.members.filter(mem => !mem.user.bot && !mem.voice.deaf && !mem.voice.selfDeaf).size < 1)) {
                  setTimeout(async () => {
                    try {
                      var voiceChannel: any;
                      voiceChannel = newState.guild.channels.cache.get(player.voiceChannel) as Discord.VoiceChannel;
                      if(voiceChannel) voiceChannel = await voiceChannel.fetch() as Discord.VoiceChannel;
                      if(!voiceChannel) voiceChannel = await newState.guild.channels.fetch(player.voiceChannel).catch(() => {}) || false;
                      if(!voiceChannel) return player.destroy();
                      if(!voiceChannel.members || voiceChannel.members.size == 0 || voiceChannel.members.filter(member => !member.user.bot && !member.voice.deaf && !member.voice.selfDeaf).size < 1) {
                        player.destroy();
                      }
                      
                    } catch (error) {
                      client.logger.error(String(error));
                    }
                  }, client.Config.Music.Player.AutoLeaveEmpty.Channel.Delay || 60000)
                }
              }
      }
    }

    // Mute Client when join
    if(newState.id === client.user.id && newState.channelId != oldState.channelId && !newState.guild.me.voice.deaf) {
      if(newState.guild.me.permissions.has(Discord.Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Discord.Permissions.FLAGS.DEAFEN_MEMBERS))) {
        newState.setDeaf(true);
      }
    }

    // Anti Unmute Client
    if(newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
      if(newState.guild.me.permissions.has(Discord.Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Discord.Permissions.FLAGS.DEAFEN_MEMBERS))) {
        newState.setDeaf(true);
        var textChannel = newState.guild.channels.cache.get(player.textChannel) as Discord.TextChannel;

        textChannel.send({ embeds: [ new Discord.MessageEmbed()
          .setColor("#c20e00")
          .setAuthor(client.user.tag, client.user.displayAvatarURL())
          .setDescription(await client.translate("Events/VoiceStateUpdate:UNMute", textChannel))
          .setTimestamp()
          .setFooter(await client.translate("Events/VoiceStateUpdate:Embed:Footer", textChannel))
        ]})
      }
    }
  }
};
