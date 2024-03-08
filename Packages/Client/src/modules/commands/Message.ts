import { Content } from "@/types";
import { messageOptions } from "@/utils/Tools";

import {
	EmojiResolvable,
	Message,
	MessageEditOptions,
	MessageReaction,
	StartThreadOptions,
	TextBasedChannel,
	TextChannel,
	ThreadChannel,
	User,
} from "discord.js";

export class MessageTools {
	public static async send(target: User | TextBasedChannel, content: Content): Promise<Message> {
		const msgOptions = messageOptions(content);
		return await target.send(msgOptions);
	}

	public static async reply(message: Message, content: Content): Promise<Message> {
		const msgOptions = messageOptions(content);
		return await message.reply(msgOptions);
	}

	public static async edit(message: Message, content: Content): Promise<Message> {
		const msgOptions = messageOptions(content) as MessageEditOptions;
		return await message.edit(msgOptions);
	}

	public static async react(message: Message, emoji: EmojiResolvable): Promise<MessageReaction> {
		return await message.react(emoji);
	}

	public static async pin(message: Message): Promise<Message> {
		return await message.pin();
	}

	public static async unpin(message: Message): Promise<Message> {
		return await message.unpin();
	}

	public static async startThread(message: Message, options: StartThreadOptions): Promise<ThreadChannel> {
		return await message.startThread(options);
	}

	public static async delete(message: Message): Promise<Message> {
		return await message.delete();
	}

	public static async get(channel: TextChannel, id: string): Promise<Message> {
		return channel.messages.cache.get(id);
	}
}
