import flatCache, { Cache } from "flat-cache";
import path from "path";

import Cluster from "../Models/Cache";
import { ClusterStatus } from "~/Types/enums";

export default class ClusterCache {
  private static cache: Cache = flatCache.load(
    "clusters",
    path.join(__dirname, "../.cache")
  );

  public static getAll(): Cluster[] {
    return this.cache
      .keys()
      .map((key) => this.cache.getKey(key) as Cluster)
      .sort(
        (a, b) =>
          Math.min(...a.allocatedShardIds) - Math.min(...b.allocatedShardIds)
      );
  }

  public static get(clusterId: string): Cluster {
    return this.cache.getKey(clusterId);
  }

  public static set(clusterId: string, cluster: Cluster): void {
    this.cache.setKey(clusterId, cluster);
  }

  public static remove(clusterId: string): void {
    this.cache.removeKey(clusterId);
  }

  public static save(): void {
    // "true" prevents pruning of unvisited keys
    this.cache.save(true);
  }

  public static online(): Cluster[] {
    return this.getAll().filter(
      (cluster) => cluster.status === ClusterStatus.ONLINE
    );
  }

  public static shardIds(): number[] {
    return [
      ...new Set(this.getAll().flatMap((cluster) => cluster.allocatedShardIds)),
    ].sort();
  }

  public static maxShardId(): number {
    let shardIds = this.shardIds();
    if (shardIds.length > 0) {
      return Math.max(...shardIds);
    }
  }

  public static totalShards(): number {
    let maxShardId = this.maxShardId();
    return maxShardId ? maxShardId + 1 : 0;
  }

  public static serverCount(): number {
    return new Set(
      this.getAll()
        .filter((cluster) => !!cluster.getGuilds)
        .flatMap((cluster) => cluster.getGuilds.guilds)
    ).size;
  }

  public static serversPerShard(): number {
    return Math.round(this.serverCount() / (this.totalShards() || 1));
  }
}
