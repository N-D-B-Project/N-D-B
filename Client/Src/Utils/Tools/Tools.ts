import NDBClient from "@Client/NDBClient";
import { CommandInteraction, GuildChannel, Message } from "discord.js";
import util from "node:util";
import ms from "parse-ms";

export default class Tools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  static getMomentFormat(
    mode: "time" | "calendar" = "calendar",
    lang = "pt-BR"
  ): string {
    switch (mode) {
      case "calendar":
        if (lang === "pt-BR") return "DD/MM/YYYY | LTS";
        else return "DD-MM-YYYY LTS";

      case "time":
        if (lang === "pt-BR") return "L";
        else return "DD-MM-YYYY LTS";
    }
  }

  async WAIT(ms: number): Promise<void> {
    const wait = util.promisify(setTimeout);
    return wait(ms);
  }
}