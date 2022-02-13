import { IsDefined, IsEnum, IsString, IsUrl, Length } from "class-validator";
import * as Discord from "discord.js";

export interface GetShardsResponse {
  shards: ShardInfo[];
  stats: ShardStats;
}

export interface ShardStats {
  shardCount: number;
  uptimeSecs: number;
}

export interface ShardInfo {
  id: number;
  ready: boolean;
  error: boolean;
  uptimeSecs?: number;
}

export class SetShardPresencesRequest {
  @IsDefined()
  @IsEnum(Discord.Constants.ActivityTypes)
  type: Discord.ActivityType;

  @IsDefined()
  @IsString()
  @Length(1, 128)
  name: string;

  @IsDefined()
  @IsUrl()
  url: string;
}

export interface GetShardsResponse {
  shards: ShardInfo[];
  stats: ShardStats;
}

export interface ShardStats {
  shardCount: number;
  uptimeSecs: number;
}

export interface ShardInfo {
  id: number;
  ready: boolean;
  error: boolean;
  uptimeSecs?: number;
}

export interface SetShardPresencesRequest {
  type: Discord.ActivityType;
  name: string;
  url: string;
}
