import { Content } from "@/modules/commands/types";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { ButtonsAppearance, NecordPaginationService, PageBuilder } from "@necord/pagination";
import { Inject, Injectable } from "@nestjs/common";
import { ButtonStyle, EmbedBuilder } from "discord.js";
import { Context } from "../commands/Commands.context";
import type { INDBService } from "./interfaces/INDBService";

@Injectable()
export class NDBService implements INDBService {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly paginator: NecordPaginationService,
	) {}

	public async buildPaginator(context: Context, embeds: Array<EmbedBuilder>, id: string): Promise<Content> {
		const buttons: ButtonsAppearance = {
			back: {
				emoji: "⬅️",
				label: await this.Translate.TFunction(context, "Tools/Paginator:Labels:Previous"),
				style: ButtonStyle.Secondary,
			},
			next: {
				emoji: "➡️",
				label: await this.Translate.TFunction(context, "Tools/Paginator:Labels:Next"),
				style: ButtonStyle.Secondary,
			},
		};
		this.paginator.delete(id);
		for (let i = 0; i < embeds.length; i++) {
			embeds[i].setFooter({
				text: embeds[i].data.footer?.text
					? `${embeds[i].data.footer?.text} | ${await this.Translate.TFunction(
							context,
							"Tools/Paginator:Embed:Footer",
							{
								Current: i + 1,
								Total: embeds.length,
							},
					  )}`
					: await this.Translate.TFunction(context, "Tools/Paginator:Embed:Footer", {
							Current: i + 1,
							Total: embeds.length,
					  }),
			});
		}

		const pages: PageBuilder[] = [];
		for (const embed of embeds) {
			pages.push(new PageBuilder().addEmbed(embed));
		}

		return this.paginator
			.register((builder) => builder.setCustomId(id).setPages(pages).setMaxPages(embeds.length))
			.setButtonsAppearance(buttons)
			.build();
	}
}
