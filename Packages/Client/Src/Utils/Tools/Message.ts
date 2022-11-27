import NDBClient from "@Client/NDBClient";
import { IGNORED_ERRORS } from ".";
import {
  User,
  TextBasedChannel,
  MessageOptions,
  Message,
  DiscordAPIError,
  EmojiResolvable,
  MessageReaction,
  StartThreadOptions,
  MessageEditOptions,
  ThreadChannel,
  EmbedBuilder,
} from "discord.js";

export default class MessageTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }
  public static async send(
    target: User | TextBasedChannel,
    content: string | EmbedBuilder | MessageOptions
  ): Promise<Message> {
    try {
      let msgOptions = this.messageOptions(content);
      return await target.send(msgOptions);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async reply(
    message: Message,
    content: string | EmbedBuilder | MessageOptions
  ): Promise<Message> {
    try {
      let msgOptions = this.messageOptions(content);
      return await message.reply(msgOptions);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async edit(
    message: Message,
    content: string | EmbedBuilder | MessageOptions
  ): Promise<Message> {
    try {
      let msgOptions = this.messageOptions(content) as MessageEditOptions;
      return await message.edit(msgOptions);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async react(
    message: Message,
    emoji: EmojiResolvable
  ): Promise<MessageReaction> {
    try {
      return await message.react(emoji);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async pin(message: Message): Promise<Message> {
    try {
      return await message.pin();
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async unpin(message: Message): Promise<Message> {
    try {
      return await message.unpin();
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async startThread(
    message: Message,
    options: StartThreadOptions
  ): Promise<ThreadChannel> {
    try {
      return await message.startThread(options);
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async delete(message: Message): Promise<Message> {
    try {
      return await message.delete();
    } catch (error) {
      if (
        error instanceof DiscordAPIError &&
        IGNORED_ERRORS.includes(error.code as number)
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static messageOptions(
    content: string | EmbedBuilder | MessageOptions
  ): MessageOptions {
    let options: MessageOptions = {};
    if (typeof content === "string") {
      options.content = content;
    } else if (content instanceof EmbedBuilder) {
      options.embeds = [content];
    } else {
      options = content;
    }
    return options;
  }
}
