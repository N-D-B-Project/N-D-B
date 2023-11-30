import { Context } from "@/modules/commands/Commands.context";
import { i18nService } from "@/modules/i18n/i18n.service";
import { Config } from "@/types";
import { ConfigService } from "@nestjs/config";
import { CommandInteraction, GuildChannel, Message } from "discord.js";
import util from "node:util";
import ms from "parse-ms";

export class Tools {
  public static getMomentFormat(
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

  public static async Timer(
    Translate: i18nService,
    type: "normal" | "details",
    number: number,
    translateInfo: Message | CommandInteraction | GuildChannel | Context
  ) {
    const time = ms(number);
    const days = Translate.Guild(translateInfo, "Tools/Tools:Timer:Days"),
      hours = await Translate.Guild(translateInfo, "Tools/Tools:Timer:Hours"),
      minutes = await Translate.Guild(
        translateInfo,
        "Tools/Tools:Timer:Minutes"
      ),
      seconds = await Translate.Guild(
        translateInfo,
        "Tools/Tools:Timer:Seconds"
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

  public static async WAIT(time: number): Promise<void> {
    const wait = util.promisify(setTimeout);
    return wait(time);
  }

  public static checkOwner(config: ConfigService, target: string) {
    return config
      .getOrThrow<Config["Discord"]>("Discord")
      .Client.Owners.includes(target);
  }

  public static checkGuild(config: ConfigService, target: string) {
    return (
      config.getOrThrow<Config["Discord"]>("Discord").Servers.NDCommunity ===
        target ||
      config.getOrThrow<Config["Discord"]>("Discord").Servers.TestGuild ===
        target
    );
  }

  public static capitalize(string: string) {
    return string
      .split(" ")
      .map(str => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  public static removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  public static formatArray(array: Array<string>) {
    return new Intl.ListFormat("pt-BR", {
      style: "short",
      type: "conjunction"
    }).format(array);
  }

  public static isValidURL(string: string) {
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
