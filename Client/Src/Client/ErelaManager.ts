import NDBClient from "./NDBClient";
import * as Erela from "erela.js";
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import Apple from "better-erela.js-apple";

import "@Structures/BasePlayer";

export default class ErelaManager extends Erela.Manager {
  constructor(private client: NDBClient) {
    super({
      nodes: [
        {
          host: process.env.LavalinkHOST,
          port: 2333,
          password: process.env.LavalinkPassword,
        },
      ],
      autoPlay: true,
      plugins: [
        new Spotify({
          clientID: process.env.SpotifyID,
          clientSecret: process.env.SpotifySecret,
          albumLimit: 1,
          convertUnresolved: true,
          playlistLimit: 1,
        }),
        new Deezer({
          albumLimit: 1,
          convertUnresolved: true,
          playlistLimit: 1,
        }),
        new Facebook(),
        new Apple(),
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    client.on("raw", (data) => {
      this.updateVoiceState(data);
    });

    this.setMaxListeners(15);
  }
}
