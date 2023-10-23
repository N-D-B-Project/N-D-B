import { INDBClient } from "@/Types";
import { Context } from "@/Utils/Structures";
import { EmbedBuilder, Message } from "discord.js";
import join from "./Utils/Join";
import nowPlaying from "./Utils/NowPlaying";
import play from "./Utils/Play";

export default class Music {
  public constructor(private client: INDBClient) {}

  public async Play(context: Context): Promise<EmbedBuilder | Message> {
    try {
      return await play.run(context);
    } catch (error) {
      console.error(error);
    }
  }

  public async NowPlaying(context: Context): Promise<EmbedBuilder | Message> {
    try {
      return await nowPlaying.run(context);
    } catch (error) {
      console.error(error);
    }
  }

  public async Join(context: Context): Promise<void> {
    try {
      return await join.run(context);
    } catch (error) {
      console.error(error);
    }
  }
}
