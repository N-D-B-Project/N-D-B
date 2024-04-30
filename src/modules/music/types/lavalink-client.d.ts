import { CommandInteraction } from "discord.js";
import type { DestroyReasonsType, LavalinkNode, LavalinkPlayer, Player, PlayerJson, SponsorBlockChapterStarted, SponsorBlockChaptersLoaded, SponsorBlockSegmentSkipped, SponsorBlockSegmentsLoaded, Track, TrackEndEvent, TrackExceptionEvent, TrackStartEvent, TrackStuckEvent, UnresolvedTrack, WebSocketClosedEvent } from "lavalink-client";

export interface LavalinkManagerEvents {
  /**
   * Emitted when a Track started playing.
   * @event Manager#trackStart
   */
  "trackStart": (player: Player, track: Track, payload: TrackStartEvent) => void;
  /**
   * Emitted when a Track finished.
   * @event Manager#trackEnd
   */
  "trackEnd": (player: Player, track: Track, payload: TrackEndEvent) => void;
  /**
   * Emitted when a Track got stuck while playing.
   * @event Manager#trackStuck
   */
  "trackStuck": (player: Player, track: Track, payload: TrackStuckEvent) => void;
  /**
   * Emitted when a Track errored.
   * @event Manager#trackError
   */
  "trackError": (player: Player, track: Track | UnresolvedTrack, payload: TrackExceptionEvent) => void;
  /**
   * Emitted when the Playing finished and no more tracks in the queue.
   * @event Manager#queueEnd
   */
  "queueEnd": (player: Player, track: Track, payload: TrackEndEvent | TrackStuckEvent | TrackExceptionEvent) => void;
  /**
   * Emitted when a Player is created.
   * @event Manager#playerCreate
   */
  "playerCreate": (player: Player) => void;
  /**
   * Emitted when a Player is moved within the channel.
   * @event Manager#playerMove
   */
  "playerMove": (player: Player, oldVoiceChannelId: string, newVoiceChannelId: string) => void;
  /**
   * Emitted when a Player is disconnected from a channel.
   * @event Manager#playerDisconnect
   */
  "playerDisconnect": (player: Player, voiceChannelId: string) => void;
  /**
   * Emitted when a Node-Socket got closed for a specific Player.
   * @event Manager#playerSocketClosed
   */
  "playerSocketClosed": (player: Player, payload: WebSocketClosedEvent) => void;
  /**
   * Emitted when a Player get's destroyed
   * @event Manager#playerDestroy
   */
  "playerDestroy": (player: Player, destroyReason?: DestroyReasonsType) => void;
  /**
   * Always emits when the player (on lavalink side) got updated
   * @event Manager#playerUpdate
   */
  "playerUpdate": (oldPlayerJson: PlayerJson, newPlayer: Player) => void;
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Segments are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentsloaded
   * @event Manager#trackError
   */
  "SegmentsLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentsLoaded) => void;
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Segment was skipped
   * @link https://github.com/topi314/Sponsorblock-Plugin#segmentskipped
   * @event Manager#trackError
   */
  "SegmentSkipped": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockSegmentSkipped) => void;
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when a specific Chapter starts playing
   * @link https://github.com/topi314/Sponsorblock-Plugin#chapterstarted
   * @event Manager#trackError
   */
  "ChapterStarted": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChapterStarted) => void;
  /**
   * SPONSORBLOCK-PLUGIN EVENT
   * Emitted when Chapters are loaded
   * @link https://github.com/topi314/Sponsorblock-Plugin#chaptersloaded
   * @event Manager#trackError
   */
  "ChaptersLoaded": (player: Player, track: Track | UnresolvedTrack, payload: SponsorBlockChaptersLoaded) => void;
}

export interface NodeManagerEvents {
  /**
   * Emitted when a Node is created.
   * @event Manager.nodeManager#create
   */
  "create": (node: LavalinkNode) => void;
  /**
   * Emitted when a Node is destroyed.
   * @event Manager.nodeManager#destroy
   */
  "destroy": (node: LavalinkNode, destroyReason?: DestroyReasonsType) => void;
  /**
   * Emitted when a Node is connected.
   * @event Manager.nodeManager#connect
   */
  "connect": (node: LavalinkNode) => void;
  /**
   * Emitted when a Node is reconnecting.
   * @event Manager.nodeManager#reconnecting
  */
  "reconnecting": (node: LavalinkNode) => void;
  /**
   * Emitted when a Node is disconnects.
   * @event Manager.nodeManager#disconnect
  */
  "disconnect": (node: LavalinkNode, reason: {
      code?: number;
      reason?: string;
  }) => void;
  /**
   * Emitted when a Node is error.
   * @event Manager.nodeManager#error
  */
  "error": (node: LavalinkNode, error: Error, payload?: unknown) => void;
  /**
   * Emits every single Node event.
   * @event Manager.nodeManager#raw
  */
  "raw": (node: LavalinkNode, payload: unknown) => void;
  /**
   * Emits when the node connects resumed. You then need to create all players within this event for your usecase.
   * Aka for that you need to be able to save player data like vc channel + text channel in a db and then sync it again
   * @event Manager.nodeManager#nodeResumed
   */
  "resumed": (node: LavalinkNode, paylaod: {
      resumed: true;
      sessionId: string;
      op: "ready";
  }, players: LavalinkPlayer[]) => void;
}

declare module "lavalink-client" {
  export interface Player {
    get isPremium(): boolean;
    set isPremium(value: boolean): void;

    get lastSong(): Track[];
    set lastSong(value: Track): void;

    get originalQueue(): Queue;
    set originalQueue(value: Queue): void;

    get isShuffle(): boolean;
    set isShuffle(value): void;

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
