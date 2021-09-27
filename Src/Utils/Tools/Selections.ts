import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";
import Setup from "@Structures/Selections/Setup";

export default class Selections {
  private client: NDBClient;
  public setup: Setup;

  constructor(client) {
    this.client = client;
    this.setup = new Setup(client);
  }


}
