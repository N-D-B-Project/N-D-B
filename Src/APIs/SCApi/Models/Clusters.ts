import { Type } from "class-transformer";
import {
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from "class-validator";
import { ClusterStatus } from "~/Types/enums";
import { ShardStats } from "./Shards";

export interface GetRes {
  clusters: ClusterInfo[];
  stats: ClusterStats;
}

export interface ClusterInfo {
  id: string;
  allocatedShardIds: number[];
  status: ClusterStatus;
  shards?: ShardInfo[];
  stats?: ShardStats;
}

export interface ShardInfo {
  id: number;
  ready: boolean;
  error: boolean;
  uptimeSecs?: number;
}

export interface ClusterStats {
  clusterCount: number;
  shardCount: number;
  serverCount: number;
  serversPerShard: number;
}

export class Callback {
  @IsDefined()
  @IsUrl({ require_tld: false })
  url: string;

  @IsDefined()
  @IsString()
  @Length(5, 2000)
  token: string;
}

export class RegisterReq {
  @IsDefined()
  @IsInt()
  @IsPositive()
  shardCount: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => Callback)
  callback: Callback;
}

export interface RegisterRes {
  id: string;
}

export interface LoginRes {
  shardList: number[];
  totalShards: number;
}
