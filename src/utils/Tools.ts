import { setTimeout } from "node:timers/promises";
import {
	NestedLocalizationAdapter,
	type TranslationFn,
} from "@necord/localization";
import {
	type BaseMessageOptions,
	EmbedBuilder,
	type MessageEditOptions,
} from "discord.js";
import ms from "parse-ms";

export const Timer = async (
	translate: NestedLocalizationAdapter | TranslationFn,
	type: "normal" | "details",
	number: number,
	locale: string,
): Promise<string> => {
	const time = ms(number);

	function getTranslation(key: string): string {
		return translate instanceof NestedLocalizationAdapter
			? translate.getTranslation(`Tools.Tools.Timer.${key}`, locale)
			: translate(key);
	}

	const days = getTranslation("Days");
	const hours = getTranslation("Hours");
	const minutes = getTranslation("Minutes");
	const seconds = getTranslation("Seconds");

	switch (type) {
		case "normal":
			return ` ${time.hours ? (time.hours > 10 ? time.hours : `0${time.hours}`) : ""}${time.hours ? ":" : ""}${
				time.minutes
					? time.minutes >= 10
						? time.minutes
						: `0${time.minutes}`
					: "00"
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

export const messageOptions = (
	content: string | EmbedBuilder | BaseMessageOptions,
): BaseMessageOptions => {
	const options: BaseMessageOptions | MessageEditOptions =
		typeof content === "string"
			? { content }
			: content instanceof EmbedBuilder
				? { embeds: [content] }
				: content;

	return options;
};

export const WAIT = async (time: number): Promise<void> => {
	return setTimeout(time);
};

export const formatArray = (array: string[]) => {
	return new Intl.ListFormat("pt-BR", {
		style: "short",
		type: "conjunction",
	}).format(array);
};
