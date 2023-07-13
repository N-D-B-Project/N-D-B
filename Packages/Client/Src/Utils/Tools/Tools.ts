import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import { CommandInteraction, GuildChannel, Message } from "discord.js"
import util from "node:util"
import ms from "parse-ms"

export default class Tools {
  public constructor(private client: NDBClient) {
    this.client = client
  }

  static getMomentFormat(
    mode: "time" | "calendar" = "calendar",
    lang = "pt-BR"
  ): string {
    switch (mode) {
      case "calendar":
        if (lang === "pt-BR") return "DD/MM/YYYY | LTS"
        else return "DD-MM-YYYY LTS"

      case "time":
        if (lang === "pt-BR") return "L"
        else return "DD-MM-YYYY LTS"
    }
  }

  async Timer(
    type: "normal" | "details",
    number: number,
    translateInfo: Message | CommandInteraction | GuildChannel
  ) {
    var time = ms(number)
    const days = this.client.Translate.Guild(
        "Tools/Tools:Timer:Days",
        translateInfo
      ),
      hours = await this.client.Translate.Guild(
        "Tools/Tools:Timer:Hours",
        translateInfo
      ),
      minutes = await this.client.Translate.Guild(
        "Tools/Tools:Timer:Minutes",
        translateInfo
      ),
      seconds = await this.client.Translate.Guild(
        "Tools/Tools:Timer:Seconds",
        translateInfo
      )
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
        }`
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
        `
    }
  }

  async WAIT(ms: number): Promise<void> {
    const wait = util.promisify(setTimeout)
    return wait(ms)
  }

  public checkOwner(target: string) {
    return Config.Owners.includes(target)
  }

  public checkGuild(target: string) {
    return Config.NDCommunity.ID === target || Config.TestGuild.ID === target
  }

  public capitalize(string: string) {
    return string
      .split(" ")
      .map(str => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ")
  }

  public removeDuplicates(arr) {
    return [...new Set(arr)]
  }

  public formatArray(array: Array<any>) {
    return new Intl.ListFormat("pt-BR", {
      style: "short",
      type: "conjunction"
    }).format(array)
  }

  public resolveCommand(nameOrAlias: string) {
    return (
      this.client.Collections.commands.get(nameOrAlias) ??
      this.client.Collections.commands.get(
        this.client.Collections.aliases.get(nameOrAlias)!
      )
    )
  }

  isValidURL(string: string) {
    const args = string.split(" ")
    let url
    for (const arg of args) {
      try {
        url = new URL(arg)
        url = url.protocol === "http:" || url.protocol === "https:"
        break
      } catch (_) {
        url = false
      }
    }
    return url
  }
}
