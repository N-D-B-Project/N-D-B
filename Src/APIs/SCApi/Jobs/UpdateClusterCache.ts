import { FetchError } from "node-fetch";
import Cluster from "../Cache/Cluster";
import { ClusterStatus } from "~/Types/enums";
import { ClusterService } from "../Services";
import { Logger } from "@Utils/Tools";
import { Job } from "~/Types";
import { Config } from "~/Config";

export default class UpdateClusterCache implements Job {
  private logger: Logger = new Logger();
  public schedule: string = Config.APIs.SCAPI.Jobs.ScheduleCluster;
  log: boolean = Config.APIs.SCAPI.Jobs.Log;
  public name = "UpdateClusterCache";
  private updateStatus = [
    ClusterStatus.READY,
    ClusterStatus.ONLINE,
    ClusterStatus.OFFLINE,
    ClusterStatus.ERROR,
  ];

  public constructor(private clusterService: ClusterService) {}

  public async run(): Promise<void> {
    const clusters = Cluster.getAll().filter((cluster) =>
      this.updateStatus.includes(cluster.status)
    );

    for (const cluster of clusters) {
      try {
        const shards = await this.clusterService.getShards(
          cluster.callback.url,
          cluster.callback.token
        );
        cluster.getShards = shards;

        const guilds = await this.clusterService.getGuilds(
          cluster.callback.url,
          cluster.callback.token
        );
        cluster.getGuilds = guilds;

        const partiallyOnline = cluster.getShards.shards.some(
          (shard) => !(shard.ready === true && shard.error === false)
        );
        cluster.status = partiallyOnline
          ? ClusterStatus.PARTIALLY_ONLINE
          : ClusterStatus.ONLINE;
      } catch (error) {
        this.logger.error(
          `[Cluster: ${cluster.id}] Erro ao atualizar o Cache: ${error}`
        );
        if (error instanceof FetchError && error.code === "ECONNREFUSED") {
          cluster.status = ClusterStatus.OFFLINE;
        } else {
          cluster.status = ClusterStatus.ERROR;
        }
      }
      Cluster.set(cluster.id, cluster);
    }
    Cluster.save();
  }
}
