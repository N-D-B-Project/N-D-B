import { GetShardsResponse } from "./Shards";
import { GetGuildsResponse } from "./Guilds";
import { ClusterStatus } from "~/Types/enums";

export default interface Cluster {
  id: string;
  status: ClusterStatus;
  allocatedShardIds: number[];
  callback: {
    url: string;
    token: string;
  };
  getShards?: GetShardsResponse;
  getGuilds?: GetGuildsResponse;
}
