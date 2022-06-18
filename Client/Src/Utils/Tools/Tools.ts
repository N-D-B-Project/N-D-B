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

  async Timer(
    type: string,
    number: number,
    translateInfo: Message | CommandInteraction | GuildChannel
  ) {
    var time = ms(number);
    const days = this.client.translate("Tools/Tools:Timer:Days", translateInfo),
      hours = await this.client.translate(
        "Tools/Tools:Timer:Hours",
        translateInfo
      ),
      minutes = await this.client.translate(
        "Tools/Tools:Timer:Minutes",
        translateInfo
      ),
      seconds = await this.client.translate(
        "Tools/Tools:Timer:Seconds",
        translateInfo
      );
    switch (type) {
      case "normal":
        return ` ${
          time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""
        }${time.hours ? ":" : ""}${
          time.minutes
            ? time.minutes >= 10
              ? time.minutes
              : `0${time.minutes}`
            : "00"
        }:${
          time.seconds
            ? time.seconds > 10
              ? time.seconds
              : `0${time.seconds}`
            : ""
        }`;
      case "details":
        return ` 
        ${days}${
          time.hours ? (time.days > 10 ? time.days : `0${time.days}`) : ""
        }${time.days ? ":" : ""}
        ${hours}${
          time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""
        }${time.hours ? ":" : ""}
        ${minutes}${
          time.minutes
            ? time.minutes >= 10
              ? time.minutes
              : `0${time.minutes}`
            : "00"
        }
        ${seconds}${
          time.seconds
            ? time.seconds > 10
              ? time.seconds
              : `0${time.seconds}`
            : ""
        }
        `;
    }
  }

  async WAIT(ms: number): Promise<void> {
    const wait = util.promisify(setTimeout);
    return wait(ms);
  }

  isValidURL(string: string) {
    const args = string.split(" ");
    let url;
    for (const arg of args) {
      try {
        url = new URL(arg);
        url = url.protocol === "http:" || url.protocol === "https:";
        break;
      } catch (_) {
        url = false;
      }
    }
    return url;
  }
}
