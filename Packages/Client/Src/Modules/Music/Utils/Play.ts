import NDBClient from "@/Core/NDBClient"
import { SwitchCommand } from "@/Types"
import { MessageTools } from "@/Utils/Tools"
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message,
  User,
  VoiceChannel
} from "discord.js"
import { Player, SearchResult } from "erela.js"
import MusicEmbeds from "./Embeds"
import MusicTools from "./Tools"

export default class Play {
  public static async _Legacy(
    message: Message,
    args: Array<string>
  ): Promise<EmbedBuilder | Message> {
    const Embeds = new MusicEmbeds(message.client as NDBClient)
    const Search = args.join(" ")
    var res: SearchResult
    if (!MusicTools.hasVoice(message.member))
      return MessageTools.reply(message, await Embeds.NoChannelEmbed(message))

    if (!Search)
      return MessageTools.reply(message, await Embeds.NoArgsEmbed(message))

    var Player = await MusicTools.getPlayer(
      message.client as NDBClient,
      message.guildId
    )
    if (!Player)
      Player = await MusicTools.createPlayer(
        message.client as NDBClient,
        message.member.voice.channel as VoiceChannel,
        message.channelId
      )

    if (Player.state !== "CONNECTED") {
      Player.SetIsSlash(false)
      Player.SetPlayerAuthor(message.author)
      Player.connect()
      Player.stop()
    }

    if ((message.client as NDBClient).Tools.isValidURL(Search)) {
      res = await Player.search(Search, message.author.id)
    } else {
      res = await Player.search(
        {
          query: Search
        },
        message.author
      )
    }

    return await this.LoadType(res, Player, { MsgInt: message, args }, false)
  }

  public static async _Slash(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ): Promise<EmbedBuilder | Message> {
    return
  }

  private static async LoadType(
    res: SearchResult,
    player: Player,
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean
  ) {
    const Embeds = new MusicEmbeds(MsgInt.client as NDBClient)
    var Embed: EmbedBuilder
    // var status: boolean = false
    switch (res.loadType) {
      case "error":
        if (!player.queue.current) player.destroy()
        Embed = await Embeds.LoadTypeEmbeds(MsgInt, "Fail")
        break
      case "empty":
        if (!player.queue.current) player.destroy()
        Embed = await Embeds.LoadTypeEmbeds(MsgInt, "NoMatches")
        break
      case "search":
      case "track":
        if (player.state !== "CONNECTED") {
          player.SetPlayerMessage(MsgInt as Message)
          player.SetPlayerAuthor(MsgInt.member.user as User)
          player.connect()
        }
        if (!player.playing) {
          player.queue.add(res.tracks[0])
          player.play()
          if (!player.paused && !player.playing) player.pause(false)
        } else {
          player.queue.add(res.tracks[0])
        }
        Embed = await Embeds.LoadTypeEmbeds(
          MsgInt,
          "Success",
          args,
          isSlash,
          res.tracks[0]
        )
        // for some reason lavalink sometimes returns status 2 times with this part of code prevents Embed from being sent 2 times
        // if (!status) return
        // status = true
        // end of the duplication sent prevention code
        break
      case "playlist":
        await this.Playlist(res, player, { MsgInt, args }, isSlash)
        break
    }

    return Embed
  }

  private static async Playlist(
    res: SearchResult,
    player: Player,
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean
  ) {
    const URL = await (MsgInt.client as NDBClient).Tools.isValidURL(
      isSlash
        ? (args as CommandInteractionOptionResolver).getString("query")
        : (args as Array<string>).join(" ")
    )
    player.queue.add(res.tracks)
  }
}
