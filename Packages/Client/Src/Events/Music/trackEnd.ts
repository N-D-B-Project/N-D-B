/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventOptions, INDBClient } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { Player, Track, TrackEndEvent } from "lavalink-client";

export default class trackEndEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "trackEnd",
      type: "on",
      emitter: "music",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: INDBClient,
    player: Player,
    track: Track,
    payload: TrackEndEvent
  ) {
    player.lastSong = track;
  }
}
