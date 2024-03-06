import { Content } from "@/types";
import { Extends } from "@/types/Constants";
import { INDBService, Ii18nService } from "@/types/Interfaces";
import { NecordPaginationService, PageBuilder } from "@necord/pagination";
import { Inject, Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { Context } from "../commands/Commands.context";

@Injectable()
export class NDBService implements INDBService {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly paginator: NecordPaginationService,
	) {}

	public async buildPaginator(context: Context, embeds: Array<EmbedBuilder>, id: string): Promise<Content> {
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
		for (let i = 0; i < embeds.length; i++) {
			pages.push(new PageBuilder().addEmbed(embeds[i]));
		}

		return this.paginator
			.register((builder) => builder.setCustomId(id).setPages(pages).setMaxPages(embeds.length))
			.build();
	}
}
