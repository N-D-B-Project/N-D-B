import NDBClient from "@/Core/NDBClient"
import { SwitchCommand } from "@/Types"
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message
} from "discord.js"
import play from "./Utils/Play"

export default class Music {
  public constructor(client: NDBClient) {}

  public async Play(
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean
  ): Promise<EmbedBuilder | Message> {
    try {
      if (!isSlash)
        return await play._Legacy(MsgInt as Message, args as Array<string>)
      else
        return await play._Slash(
          MsgInt as CommandInteraction,
          args as CommandInteractionOptionResolver
        )
    } catch (error) {
      console.error(error)
    }
  }
}
