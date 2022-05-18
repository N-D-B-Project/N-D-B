import NDBClient from "@Client/NDBClient";
import { Status } from "./Content";

export default class StartApps {
  private Status: Status;
  constructor(private client: NDBClient) {
    this.client = client;
    this.Status = new Status(client);
  }

  async InitAll() {
    await this.Status.App();
  }
}
