import {
  CommandInteraction,
  Guild,
  TextChannel,
  VoiceChannel
} from "discord.js";
import { Track } from "erela.js";

export interface playerInfo {
  guild: Guild;
  voiceChannel: VoiceChannel;
  textChannel: TextChannel;
  selfMute: boolean;
  selfDeafen: boolean;
  region: string;
  instaUpdateFiltersFix: boolean;
}

export interface ErelaEvents {
  nodeCreate;
  nodeConnect;
  nodeReconnect;
  nodeDisconnect;
  nodeError;
  nodeRaw;
  playerCreate;
  playerDestroy;
  queueEnd;
  playerMove;
  playerDisconnect;
  trackStart;
  trackEnd;
  trackStuck;
  trackError;
  socketClosed;
}

declare module "erela.js" {
  export interface Player {
    private _lastSong: Array<Track>;
    private _songMessage: string;
    private _playerMessage: string;
    private _playerAuthor: string;
    private _slash: {
      isSlash: boolean;
      interaction?: CommandInteraction;
    };

    get lastSong(): Array<Track>;
    set lastSong(value: Track): void;

    get songMessage(): string;
    set songMessage(messageId: string): void;

    get playerMessage(): string;
    set playerMessage(messageId: string): void;

    get playerAuthor(): string;
    set playerAuthor(authorId: string): void;

    get slash(): {
      isSlash: boolean;
      interaction: CommandInteraction;
    };
    set slash(value: {
      isSlash: boolean;
      interaction?: CommandInteraction;
    }): void;
  }
}
