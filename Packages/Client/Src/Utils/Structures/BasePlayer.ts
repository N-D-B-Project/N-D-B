import { CommandInteraction } from "discord.js";
import { Player, Queue, Track } from "lavalink-client";

export default class BasePlayer extends Player {
  private _isPremium = false;
  private _lastSong: Array<Track> = [];
  private _originalQueue: Queue;
  private _isShuffle = false;
  private _songMessage: string;
  private _playerMessage: string;
  private _playerAuthor: string;
  private _isSlash: boolean;
  private _interaction?: CommandInteraction;

  constructor(args) {
    super(args, args);
  }

  public get isPremium(): boolean {
    return this._isPremium;
  }

  public set isPremium(value: boolean) {
    this._isPremium = value;
  }

  public get lastSong(): Array<Track> {
    return this._lastSong;
  }

  public set lastSong(value: Track) {
    this._lastSong.push(value);
  }

  public get originalQueue(): Queue {
    return this._originalQueue;
  }

  public set originalQueue(value: Queue) {
    this._originalQueue = value;
  }

  public get isShuffle(): boolean {
    return this._isShuffle;
  }

  public set isShuffle(value) {
    this.isShuffle = value;
  }

  public get songMessage(): string {
    return this._songMessage;
  }

  public set songMessage(messageId: string) {
    this._songMessage = messageId;
  }

  public get playerMessage(): string {
    return this._playerMessage;
  }
  public set playerMessage(messageId: string) {
    this._playerMessage = messageId;
  }

  public get playerAuthor(): string {
    return this._playerAuthor;
  }

  public set playerAuthor(authorId) {
    this._playerAuthor = authorId;
  }

  public get slash(): {
    isSlash: boolean;
    interaction: CommandInteraction;
  } {
    return {
      isSlash: this._isSlash,
      interaction: this._interaction
    };
  }
  public set slash({ isSlash, interaction }) {
    this._isSlash = isSlash;
    this._interaction = interaction;
  }
}
