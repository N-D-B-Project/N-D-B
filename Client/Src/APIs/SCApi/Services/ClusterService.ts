import { URL } from "url";

import { HttpService } from ".";
import { GetShardsResponse, SetShardPresencesRequest } from "../Models/Shards";
import { GetGuildsResponse } from "../Models/Guilds";

export default class ClusterService {
  constructor(private httpService: HttpService) {}

  public async getShards(
    baseUrl: string,
    token: string
  ): Promise<GetShardsResponse> {
    let res = await this.httpService.get(new URL(`/shards`, baseUrl), token);

    if (!res.ok) {
      throw res;
    }

    return res.json();
  }

  public async setShardPresences(
    baseUrl: string,
    token: string,
    setShardPresencesReq: SetShardPresencesRequest
  ): Promise<void> {
    let res = await this.httpService.put(
      new URL(`/shards/presence`, baseUrl),
      token,
      setShardPresencesReq
    );

    if (!res.ok) {
      throw res;
    }
  }

  public async getGuilds(
    baseUrl: string,
    token: string
  ): Promise<GetGuildsResponse> {
    let res = await this.httpService.get(new URL(`/guilds`, baseUrl), token);

    if (!res.ok) {
      throw res;
    }

    return res.json();
  }
}
