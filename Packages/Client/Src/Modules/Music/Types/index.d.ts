import {
  CommandInteraction,
  Guild,
  Message,
  TextChannel,
  User,
  VoiceChannel
} from "discord.js"
import { Track } from "erela.js"

export interface playerInfo {
  guild: Guild
  voiceChannel: VoiceChannel
  textChannel: TextChannel
  selfMute: boolean
  selfDeafen: boolean
  region: string
  instaUpdateFiltersFix: boolean
}

export interface ErelaEvents {
  nodeCreate
  nodeCreate
  nodeConnect
  nodeReconnect
  nodeDisconnect
  nodeError
  nodeRaw
  playerCreate
  playerDestroy
  queueEnd
  playerMove
  playerDisconnect
  trackStart
  trackEnd
  trackStuck
  trackError
  socketClosed
}

declare module "erela.js" {
  interface Player {
    LastSong: Array<Track>
    AddLastSong(track: Track)

    SongMessage: string
    SetCurrentSongMessage(message: Message)

    PlayerMessage: string
    SetPlayerMessage(message: Message)

    PlayerAuthor: string
    SetPlayerAuthor(user: User)

    isSlash: boolean
    SlashInteraction: CommandInteraction
    SetIsSlash(isSlash: boolean, interaction?: CommandInteraction)
  }
}
