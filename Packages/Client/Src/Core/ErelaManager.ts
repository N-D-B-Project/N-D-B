import { Manager } from "erela.js"
import NDBClient from "./NDBClient"

import "@/Utils/Structures/BasePlayer"
export default class ErelaManager extends Manager {
  constructor(private readonly client: NDBClient) {
    super({
      nodes: [
        {
          regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
          identifier: "localhost",
          host: process.env.LavalinkHOST,
          port: 2333,
          password: process.env.LavalinkPassword,
          retryAmount: 22,
          retryDelay: 5000,
          useVersionPath: true,
          version: "v4"
        }
      ],
      defaultSearchPlatform: "ytmsearch",
      volumeDecrementer: 0.75,
      position_update_interval: 100,
      clientName: client.user?.username,
      clientId: client.user?.id,
      validUnresolvedUris: [
        "open.spotify.com",
        "spotify.com",
        "twitch.com",
        "twitch.tv",
        "vimeo.com",
        "bandcamp.com",
        "music.apple.com"
      ],
      autoPlay: true,
      allowedLinksRegexes: Object.values(Manager.regex),
      plugins: [],
      send(id, payload) {
        return client.ws.shards
          .get(client.guilds.cache.get(id)!.shardId)!
          .send(payload)
      }
    })

    client.on("raw", data => {
      switch (data.t) {
        case "VOICE_SERVER_UPDATE":
        case "VOICE_STATE_UPDATE":
          this.updateVoiceState(data.d)
          break
      }
    })

    this.setMaxListeners(16)
  }

  public load(): void {
    this.init(this.client.user.id, {
      clientName: `${this.client.user.username} - ErelaJS-Manager`,
      clientId: this.client.user.id
    })
  }
}
