import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";
import Setup from "@Structures/Selections/Setup";

export default class Selections {
  client: NDBClient;
  setup: Setup;

  constructor(client) {
    this.client = client;
    this.setup = new Setup(client);
  }

    
}
