import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import util from "node:util"

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
}
