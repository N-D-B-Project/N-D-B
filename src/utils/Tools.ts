import util from "node:util";
import { NestedLocalizationAdapter, TranslationFn } from "@necord/localization";
import {
	BaseMessageOptions,
	EmbedBuilder,
	MessageEditOptions,
} from "discord.js";
import ms from "parse-ms";

export const Timer = async (
	translate: NestedLocalizationAdapter | TranslationFn,
	type: "normal" | "details",
	number: number,
	translateInfo: string,
): Promise<string> => {
	const time = ms(number);
	const days =
		translate instanceof NestedLocalizationAdapter
			? (translate as NestedLocalizationAdapter).getTranslation(
					"Tools/Tools:Timer:Days",
					translateInfo,
				)
			: (translate as TranslationFn)("Tools/Tools:Timer:Days");
	const hours =
		translate instanceof NestedLocalizationAdapter
			? (translate as NestedLocalizationAdapter).getTranslation(
					"Tools/Tools:Timer:Hours",
					translateInfo,
				)
			: (translate as TranslationFn)("Tools/Tools:Timer:Hours");
	const minutes =
		translate instanceof NestedLocalizationAdapter
			? (translate as NestedLocalizationAdapter).getTranslation(
					"Tools/Tools:Timer:Minutes",
					translateInfo,
				)
			: (translate as TranslationFn)("Tools/Tools:Timer:Minutes");
	const seconds =
		translate instanceof NestedLocalizationAdapter
			? (translate as NestedLocalizationAdapter).getTranslation(
					"Tools/Tools:Timer:Seconds",
					translateInfo,
				)
			: (translate as TranslationFn)("Tools/Tools:Timer:Seconds");
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

export const formatArray = (array: string[]) => {
	return new Intl.ListFormat("pt-BR", {
		style: "short",
		type: "conjunction",
	}).format(array);
};
