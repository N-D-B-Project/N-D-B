import { Context } from "@/Utils/Structures";
import { EmbedBuilder, Message } from "discord.js";
import join from "./Utils/Join";
import Leave from "./Utils/Leave";
import nowPlaying from "./Utils/NowPlaying";
import Pause from "./Utils/Pause";
import play from "./Utils/Play";
import Queue from "./Utils/Queue";
import Resume from "./Utils/Resume";
import Stop from "./Utils/Stop";

export default class Music {
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
      context.client.logger.error(error);
    }
  }

  public async Join(context: Context): Promise<string> {
    try {
      return await join.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }

  public async Leave(context: Context): Promise<string> {
    try {
      return await Leave.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }

  public async Pause(context: Context): Promise<string> {
    try {
      return await Pause.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }

  public async Resume(context: Context): Promise<string> {
    try {
      return await Resume.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }

  public async Stop(context: Context): Promise<string> {
    try {
      return await Stop.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }

  public async Queue(context: Context): Promise<Message> {
    try {
      return await Queue.run(context);
    } catch (error) {
      context.client.logger.error(error);
    }
  }
}
