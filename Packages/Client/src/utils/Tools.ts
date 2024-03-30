import util from "node:util";
import { Context } from "@/modules/bot/commands/Commands.context";
import type { Ii18nService } from "@/modules/bot/i18n/interfaces/Ii18nService";
import {
	BaseMessageOptions,
	CommandInteraction,
	EmbedBuilder,
	GuildChannel,
	Message,
	MessageEditOptions,
} from "discord.js";
import ms from "parse-ms";

export const Timer = async (
	Translate: Ii18nService,
	type: "normal" | "details",
	number: number,
	translateInfo: Message | CommandInteraction | GuildChannel | Context,
): Promise<string> => {
	const time = ms(number);
	const days = await Translate.Guild(translateInfo, "Tools/Tools:Timer:Days");
	const hours = await Translate.Guild(translateInfo, "Tools/Tools:Timer:Hours");
	const minutes = await Translate.Guild(translateInfo, "Tools/Tools:Timer:Minutes");
	const seconds = await Translate.Guild(translateInfo, "Tools/Tools:Timer:Seconds");
	switch (type) {
		case "normal":
			return ` ${time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""}${time.hours ? ":" : ""}${
				time.minutes ? (time.minutes >= 10 ? time.minutes : `0${time.minutes}`) : "00"
			}:${time.seconds ? (time.seconds > 10 ? time.seconds : `0${time.seconds}`) : ""}`;
		case "details":
			return ` 
      ${days}${time.hours ? (time.days > 10 ? time.days : `0${time.days}`) : ""}${time.days ? ":" : ""}
      ${hours}${time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""}${time.hours ? ":" : ""}
      ${minutes}${time.minutes ? (time.minutes >= 10 ? time.minutes : `0${time.minutes}`) : "00"}
      ${seconds}${time.seconds ? (time.seconds > 10 ? time.seconds : `0${time.seconds}`) : ""}
      `;
	}
};

export const messageOptions = (content: string | EmbedBuilder | BaseMessageOptions): BaseMessageOptions => {
	const options: BaseMessageOptions | MessageEditOptions =
		typeof content === "string" ? { content } : content instanceof EmbedBuilder ? { embeds: [content] } : content;

	return options;
};

export const WAIT = async (time: number): Promise<void> => {
	const wait = util.promisify(setTimeout);
	return wait(time);
};

export const isValidURL = (string: string): URL | boolean => {
	const args = string.split(" ");
	let url: URL | boolean;
	for (const arg of args) {
		try {
			url = new URL(arg);
			url = url.protocol === "http:" || url.protocol === "https:";
			break;
		} catch (_) {
			url = false;
		}
	}
	return url;
};
