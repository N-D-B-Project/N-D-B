import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Context } from "../commands/Commands.context";

@Injectable()
export class Buttons {
	public constructor(@Inject(Extends.Translate) private readonly Translate: Ii18nService) {}

	public async Confirm(context: Context): Promise<ActionRowBuilder<ButtonBuilder>> {
		return new ActionRowBuilder<ButtonBuilder>().addComponents([
			new ButtonBuilder()
				.setCustomId("confirm/yes")
				.setLabel(await this.Translate.Guild(context, "Tools/Buttons:Labels:Confirm:YES"))
				.setEmoji("719710630881525881")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("confirm/no")
				.setLabel(await this.Translate.Guild(context, "Tools/Buttons:Labels:Confirm:NO"))
				.setEmoji("719710607405875321")
				.setStyle(ButtonStyle.Danger),
		]);
	}
}

export enum ConfirmButtonEnum {
	Yes = "tes",
	No = "no",
}
