import { Config } from "~/Config";
import { HttpService } from ".";
import { RegisterReq, RegisterRes, LoginRes } from "../Models/Clusters";

export default class RootService {
  private ClusterId: string;

  public constructor(private HttpService: HttpService) {}

  public async Register(): Promise<void> {
    const reqBody: RegisterReq = {
      shardCount: Config.Sharding.shardCount,
      callback: {
        url: Config.Sharding.callbackUrl,
        token: process.env.SCApi_Secret,
      },
    };

    const res = await this.HttpService.post(
      new URL("/clusters", Config.Sharding.RootServiceUrl),
      process.env.SCApi_Secret,
      reqBody
    );

    if (res.ok) {
      throw res;
    }

    const resBody = (await res.json()) as RegisterRes;
    this.ClusterId = resBody.id;
  }

  public async Login(): Promise<LoginRes> {
    const res = await this.HttpService.put(
      new URL(
        `/clusters/${this.ClusterId}/login`,
        Config.Sharding.RootServiceUrl
      ),
      process.env.SCApi_Secret
    );

    if (!res.ok) {
      throw res;
    }

    return (await res.json()) as LoginRes;
  }

  public async ready(): Promise<void> {
    const res = await this.HttpService.put(
      new URL(
        `/clusters/${this.ClusterId}/ready`,
        Config.Sharding.RootServiceUrl
      ),
      process.env.SCApi_Secret
    );

    if (!res.ok) {
      throw res;
    }
  }
}
