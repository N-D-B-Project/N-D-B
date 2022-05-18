import * as Discord from "discord.js";
import NDBClient from "@Client/NDBClient";
import { IGNORED_ERRORS } from ".";

export default class MessageTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }
  public static async send(
    target: Discord.User | Discord.TextBasedChannel,
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Promise<Discord.Message> {
    try {
      let msgOptions = this.messageOptions(content);
      return await target.send(msgOptions);
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async reply(
    message: Discord.Message,
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Promise<Discord.Message> {
    try {
      let msgOptions = this.messageOptions(content);
      return await message.reply(msgOptions);
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async edit(
    message: Discord.Message,
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Promise<Discord.Message> {
    try {
      let msgOptions = this.messageOptions(content);
      return await message.edit(msgOptions);
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async react(
    message: Discord.Message,
    emoji: Discord.EmojiResolvable
  ): Promise<Discord.MessageReaction> {
    try {
      return await message.react(emoji);
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async pin(message: Discord.Message): Promise<Discord.Message> {
    try {
      return await message.pin();
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async unpin(
    message: Discord.Message
  ): Promise<Discord.Message> {
    try {
      return await message.unpin();
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async startThread(
    message: Discord.Message,
    options: Discord.StartThreadOptions
  ): Promise<Discord.ThreadChannel> {
    try {
      return await message.startThread(options);
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async delete(
    message: Discord.Message
  ): Promise<Discord.Message> {
    try {
      return await message.delete();
    } catch (error) {
      if (
        error instanceof Discord.DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static messageOptions(
    content: string | Discord.MessageEmbed | Discord.MessageOptions
  ): Discord.MessageOptions {
    let options: Discord.MessageOptions = {};
    if (typeof content === "string") {
      options.content = content;
    } else if (content instanceof Discord.MessageEmbed) {
      options.embeds = [content];
    } else {
      options = content;
    }
    return options;
  }
}
