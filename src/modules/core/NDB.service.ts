import type { Content } from "@/types";
import {
	LOCALIZATION_ADAPTER,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NestedLocalizationAdapter,
} from "@necord/localization";

import {
	type ButtonsAppearance,
	// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
	NecordPaginationService,
	PageBuilder,
} from "@necord/pagination";
import { Inject, Injectable } from "@nestjs/common";
import {
	ButtonStyle,
	type CommandInteraction,
	type EmbedBuilder,
} from "discord.js";
import type { INDBService } from "./interfaces/INDBService";

@Injectable()
export class NDBService implements INDBService {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly paginator: NecordPaginationService,
	) {}

	public async buildPaginator(
		interaction: CommandInteraction,
		embeds: EmbedBuilder[],
		id: string,
	): Promise<Content> {
		const buttons: ButtonsAppearance = {
			back: {
				emoji: "⬅️",
				label: this.translate.getTranslation(
					"Tools.Paginator.Labels.Previous",
					interaction.guildLocale,
				),
				style: ButtonStyle.Secondary,
			},
			next: {
				emoji: "➡️",
				label: this.translate.getTranslation(
					"Tools.Paginator.Labels.Next",
					interaction.guildLocale,
				),
				style: ButtonStyle.Secondary,
			},
		};
		this.paginator.delete(id);
		for (let i = 0; i < embeds.length; i++) {
			embeds[i].setFooter({
				text: embeds[i].data.footer?.text
					? `${embeds[i].data.footer?.text} | ${this.translate.getTranslation(
							"Tools.Paginator.Embed.Footer",
							interaction.guildLocale,
							{
								Current: String(i + 1),
								Total: String(embeds.length),
							},
						)}`
					: this.translate.getTranslation(
							"Tools.Paginator.Embed.Footer",
							interaction.guildLocale,
							{
								Current: String(i + 1),
								Total: String(embeds.length),
							},
						),
			});
		}

		const pages: PageBuilder[] = [];
		for (const embed of embeds) {
			pages.push(new PageBuilder().addEmbed(embed));
		}

		return this.paginator
			.register((builder) =>
				builder.setCustomId(id).setPages(pages).setMaxPages(embeds.length),
			)
			.setButtonsAppearance(buttons)
			.build();
	}
}
