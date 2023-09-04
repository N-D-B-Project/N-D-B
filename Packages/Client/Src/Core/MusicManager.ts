/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Config } from "@/Config/Config";
import "@/Utils/Structures/BasePlayer";
import { Redis } from "ioredis";
import {
  LavalinkManager as Manager,
  ManagerQueueOptions,
  QueueChangesWatcher,
  QueueStoreManager,
  StoredQueue
} from "lavalink-client";
import NDBClient from "./NDBClient";

export default class MusicManager {
  public common: commonManager;
  public premium: premiumManager;
  private redis: RedisClient;
  constructor(private readonly client: NDBClient) {
    this.common = new commonManager(client);
    this.redis = new RedisClient(client);
    this.premium = new premiumManager(client, this.redis);
  }

  public async load() {
    await this.common.load();
    await this.premium.load();
  }
}

class BaseLavalinkManager extends Manager {
  constructor(
    private readonly client: NDBClient,
    { clientOptions, queueOptions, debugOptions }: options
  ) {
    super({
      nodes: [
        {
          regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
          id: "localhost",
          host: process.env.LavalinkHOST,
          port: 2333,
          authorization: process.env.LavalinkPassword,
          retryAmount: 22,
          retryDelay: 5000
        }
      ],
      client: {
        id: Config.Client.ID,
        username: clientOptions.username
      },
      autoSkip: true,
      playerOptions: {
        applyVolumeAsFilter: false,
        clientBasedPositionUpdateInterval: 100,
        defaultSearchPlatform: "ytmsearch",
        volumeDecrementer: Config.Music.Volumes.Lavalink,
        useUnresolvedData: true,
        onDisconnect: {
          autoReconnect: false,
          destroyPlayer: false
        }
      },
      queueOptions,
      sendToShard(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (!guild) {
          return client.logger.error("sendToShard - guild not found: ", id);
        }
        if (!guild.shard) {
          return client.logger.error(
            "sendToShard - guild has no shard not found: ",
            guild
          );
        }
        return guild.shard.send(payload);
      },
      debugOptions
    });

    this.setMaxListeners(10);
    this.nodeManager.setMaxListeners(7);
  }

  public async load(): Promise<void> {
    try {
      this.init({ ...this.client.user! });
    } catch (error) {
      console.log(error);
    }
  }
}

class commonManager extends BaseLavalinkManager {
  constructor(client: NDBClient) {
    super(client, {
      clientOptions: { username: "N-D-B | Music Player - Common" },
      queueOptions: { maxPreviousTracks: 1 }
    });
  }
}

class premiumManager extends BaseLavalinkManager {
  constructor(client: NDBClient, redis: RedisClient) {
    super(client, {
      clientOptions: { username: "N-D-B | Music Player - Premium" },
      queueOptions: {
        maxPreviousTracks: 10,
        queueStore: new QueueStore(redis),
        queueChangesWatcher: new QueueWatcher(client)
      },
      debugOptions: {
        noAudio: false
      }
    });
  }
}

class RedisClient extends Redis {
  constructor(private readonly DClient: NDBClient) {
    super({
      port: process.env.RedisPort as unknown as number,
      host: process.env.RedisHost
    });
  }
}

class QueueStore implements QueueStoreManager {
  constructor(private redis: RedisClient) {}

  public async get(guildId) {
    return await this.redis.get(this.id(guildId));
  }

  public async set(guildId, stringifiedQueueData) {
    // await this.delete(guildId); // redis requires you to delete it first;
    return await this.redis.set(this.id(guildId), stringifiedQueueData);
  }

  public async delete(guildId) {
    return await this.redis.del(this.id(guildId));
  }

  public async parse(stringifiedQueueData): Promise<Partial<StoredQueue>> {
    return JSON.parse(stringifiedQueueData);
  }

  public async stringify(parsedQueueData) {
    return JSON.stringify(parsedQueueData);
  }

  private id(guildId: string) {
    return `lavalinkqueue_${guildId}`;
  }
}

class QueueWatcher implements QueueChangesWatcher {
  constructor(private readonly client: NDBClient) {}
  shuffled(guildId, oldStoredQueue, newStoredQueue) {
    if (Config.Debug.PremiumMusicPlayer) {
      this.client.logger.info(
        `${
          this.client.guilds.cache.get(guildId)?.name || guildId
        }: Queue got shuffled`
      );
    }
  }

  tracksAdd(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
    if (Config.Debug.PremiumMusicPlayer) {
      this.client.logger.info(
        `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${
          tracks.length
        } Tracks got added into the Queue at position #${position}`
      );
    }
  }

  tracksRemoved(guildId, tracks, position, oldStoredQueue, newStoredQueue) {
    if (Config.Debug.PremiumMusicPlayer) {
      this.client.logger.info(
        `${this.client.guilds.cache.get(guildId)?.name || guildId}: ${
          tracks.length
        } Tracks got removed from the Queue at position #${position}`
      );
    }
  }
}

interface options {
  clientOptions: {
    username: string;
  };
  queueOptions: ManagerQueueOptions;
  debugOptions?: {
    noAudio: boolean;
  };
}
