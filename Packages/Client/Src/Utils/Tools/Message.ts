import { Content } from "@/Types/client";
import {
  EmojiResolvable,
  Message,
  MessageEditOptions,
  MessageReaction,
  StartThreadOptions,
  TextBasedChannel,
  TextChannel,
  ThreadChannel,
  User
} from "discord.js";
import { CheckError, messageOptions } from ".";

export default class MessageTools {
  public static async send(
    target: User | TextBasedChannel,
    content: Content
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content);
      return await target.send(msgOptions);
    } catch (error) {
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async reply(
    message: Message,
    content: Content
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content);
      return await message.reply(msgOptions);
    } catch (error) {
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async edit(
    message: Message,
    content: Content
  ): Promise<Message> {
    try {
      const msgOptions = messageOptions(content) as MessageEditOptions;
      return await message.edit(msgOptions);
    } catch (error) {
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
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
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }

  public static async get(channel: TextChannel, id: string): Promise<Message> {
    try {
      return channel.messages.cache.get(id);
    } catch (error) {
      if (await CheckError(error)) {
        return;
      } else {
        throw error;
      }
    }
  }
}
