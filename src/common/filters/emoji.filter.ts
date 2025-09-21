import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	type HttpException,
	Inject,
} from "@nestjs/common";
import type { ChatInputCommandInteraction } from "discord.js";
import { EmojiError } from "../errors/Emoji.error";

@Catch(EmojiError)
export class EmojiFilter implements ExceptionFilter {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly localization: NestedLocalizationAdapter,
	) {}

	public catch(_exception: HttpException, host: ArgumentsHost) {
		const interaction = host.getArgByIndex<ChatInputCommandInteraction[]>(0)[0];
		return interaction.reply({
			content: this.localization.getTranslation(
				"Common.errors.emoji",
				interaction.guildLocale,
			),
		});
	}
}
