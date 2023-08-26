/* eslint-disable no-empty-function */

import NDBClient from "@/Core/NDBClient";
import { SwitchCommand } from "@/Types";
import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  Message
} from "discord.js";
import nowPlaying from "./Utils/NowPlaying";
import play from "./Utils/Play";

export default class Music {
  public constructor(private client: NDBClient) {}

  public async Play(
    { MsgInt, args }: SwitchCommand,
    isSlash: boolean,
    isPremium: boolean
  ): Promise<EmbedBuilder | Message> {
    try {
      if (!isSlash) {
        return await play._Legacy(
          MsgInt as Message,
          args as Array<string>,
          isPremium
        );
      } else {
        return await play._Slash(
          MsgInt as CommandInteraction,
          args as CommandInteractionOptionResolver,
          isPremium
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async NowPlaying(
    { MsgInt }: SwitchCommand,
    isSlash: boolean,
    isPremium: boolean
  ): Promise<EmbedBuilder | Message> {
    try {
      if (!isSlash) {
        return await nowPlaying._Legacy(MsgInt as Message, isPremium);
      } else {
        return await nowPlaying._Slash(MsgInt as CommandInteraction, isPremium);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
