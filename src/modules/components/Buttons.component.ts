import {
  LOCALIZATION_ADAPTER,
  type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

@Injectable()
export class Buttons {
	public constructor(@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter) {}

	public async Confirm(
		locale: string,
	): Promise<ActionRowBuilder<ButtonBuilder>> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setCustomId("confirm/yes")
				.setLabel(
					this.translate.getTranslation(
						"Tools.Buttons.Labels.Confirm.YES",
						locale,
					),
				)
				.setEmoji("719710630881525881")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("confirm/no")
				.setLabel(
					this.translate.getTranslation(
						"Tools.Buttons.Labels.Confirm.NO",
						locale,
					),
				)
				.setEmoji("719710607405875321")
				.setStyle(ButtonStyle.Danger),
		]);
	}
}

export enum ConfirmButtonEnum {
	Yes = "tes",
	No = "no",
}
