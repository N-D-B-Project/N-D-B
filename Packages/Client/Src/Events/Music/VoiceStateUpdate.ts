import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

import {
  ChannelType,
  EmbedBuilder,
  TextChannel,
  VoiceChannel,
  VoiceState
} from "discord.js"

module.exports = class VoiceStateUpdateEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "voiceStateUpdate",
      type: "on",
      emitter: "client",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, oldState: VoiceState, newState: VoiceState) {
    var player = client.ErelaManager.players.get(newState.guild.id)

    // Auto set Client as Speaker in Stage Channels
    if (
      newState.channelId &&
      newState.channel.type === ChannelType.GuildStageVoice &&
      newState.guild.members.me.voice.suppress
    ) {
      if (
        newState.guild.members.me.permissions.has("Speak") ||
        (newState.channel &&
          newState.channel
            .permissionsFor(newState.guild.members.me)
            .has("Speak"))
      ) {
        newState.guild.members.me.voice.setSuppressed(false)
      }
    }

    // Auto Leave Client from Channels if is EMPTY or Everyone is MUTED
    if (oldState && (!newState.channelId || newState.channelId)) {
      if (player && oldState.channelId == player.voiceChannel) {
        if (
          !(
            (!oldState.streaming && newState.streaming) ||
            (oldState.streaming && !newState.streaming) ||
            (!oldState.serverMute &&
              newState.serverMute &&
              !newState.serverDeaf &&
              !newState.selfDeaf) ||
            (oldState.serverMute &&
              !newState.serverMute &&
              !newState.serverDeaf &&
              !newState.selfDeaf) ||
            (!oldState.selfMute &&
              newState.selfMute &&
              !newState.serverDeaf &&
              !newState.selfDeaf) ||
            (oldState.selfMute &&
              !newState.selfMute &&
              !newState.serverDeaf &&
              !newState.selfDeaf) ||
            (!oldState.selfVideo && newState.selfVideo) ||
            (oldState.selfVideo && !newState.selfVideo)
          )
        ) {
          if (
            Config.Music.Player.AutoLeaveEmpty.Channel.Enable &&
            player &&
            (!oldState.channel.members ||
              oldState.channel.members.size == 0 ||
              oldState.channel.members.filter(
                mem => !mem.user.bot && !mem.voice.deaf && !mem.voice.selfDeaf
              ).size < 1)
          ) {
            setTimeout(async () => {
              try {
                var voiceChannel: any
                voiceChannel = newState.guild.channels.cache.get(
                  player.voiceChannel
                ) as VoiceChannel
                if (voiceChannel)
                  voiceChannel = (await voiceChannel.fetch()) as VoiceChannel
                if (!voiceChannel)
                  voiceChannel =
                    (await newState.guild.channels
                      .fetch(player.voiceChannel)
                      .catch(() => {})) || false
                if (!voiceChannel) return player.destroy()
                if (
                  !voiceChannel.members ||
                  voiceChannel.members.size == 0 ||
                  voiceChannel.members.filter(
                    member =>
                      !member.user.bot &&
                      !member.voice.deaf &&
                      !member.voice.selfDeaf
                  ).size < 1
                ) {
                  player.destroy()
                }
              } catch (error) {
                client.logger.error(String(error))
              }
            }, Config.Music.Player.AutoLeaveEmpty.Channel.Delay || 60000)
          }
        }
      }
    }

    // Mute Client when join
    if (
      newState.id === client.user.id &&
      newState.channelId != oldState.channelId &&
      !newState.guild.members.me.voice.deaf
    ) {
      if (
        newState.guild.members.me.permissions.has("DeafenMembers") ||
        (newState.channel &&
          newState.channel
            .permissionsFor(newState.guild.members.me)
            .has("DeafenMembers"))
      ) {
        newState.setDeaf(true)
      }
    }

    // Anti Unmute Client
    if (
      newState.id === client.user.id &&
      oldState.serverDeaf === true &&
      newState.serverDeaf === false
    ) {
      if (
        newState.guild.members.me.permissions.has("DeafenMembers") ||
        (newState.channel &&
          newState.channel
            .permissionsFor(newState.guild.members.me)
            .has("DeafenMembers"))
      ) {
        newState.setDeaf(true)
        var textChannel = newState.guild.channels.cache.get(
          player.textChannel
        ) as TextChannel

        textChannel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#c20e00")
              .setAuthor({
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL()
              })
              .setDescription(
                await client.Translate.Guild(
                  "Events/VoiceStateUpdate:UNMute",
                  textChannel
                )
              )
              .setTimestamp()
              .setFooter({
                text: await client.Translate.Guild(
                  "Events/VoiceStateUpdate:Embed:Footer",
                  textChannel
                )
              })
          ]
        })
      }
    }
  }
}
