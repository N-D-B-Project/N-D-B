import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import { Inject, Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client, EmbedBuilder, type User } from "discord.js";
import { Colors } from "@/types/Colors";
import type { ITicketsEmbeds, TicketTypeData } from "./interfaces";

@Injectable()
export class TicketEmbeds implements ITicketsEmbeds {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly client: Client,
	) {}

	private t(
		key: string,
		locale: string,
		args?: Record<string, string>,
	): string {
		return this.translate.getTranslation(key, locale, args);
	}

	public SelectTypeEmbed(locale: string): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(this.t("Tickets.open.embed.select_title", locale))
			.setDescription(this.t("Tickets.open.embed.select_description", locale))
			.setColor(Colors.Info)
			.setFooter({
				text: this.client.user.username,
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public ConfirmTypeEmbed(
		locale: string,
		ticketType: TicketTypeData,
	): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(`${ticketType.emoji} ${ticketType.name}`)
			.setDescription(ticketType.description)
			.setColor(Colors.Info)
			.setFooter({
				text: this.t("Tickets.open.embed.confirm_footer", locale),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public OpenTicketEmbed(
		locale: string,
		ticketType: TicketTypeData,
		message: string,
	): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(`${ticketType.emoji} ${ticketType.name}`)
			.setDescription(message)
			.setColor(Colors.Primary)
			.setFooter({
				text: this.t("Tickets.open.embed.footer", locale),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public CloseTicketEmbed(locale: string, user: User): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(this.t("Tickets.close.embed.title", locale))
			.setDescription(
				this.t("Tickets.close.embed.description", locale, {
					USER: user.toString(),
				}),
			)
			.setColor(Colors.Error)
			.setFooter({
				text: this.client.user.username,
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}

	public ListTypesEmbed(
		locale: string,
		ticketTypes: TicketTypeData[],
	): EmbedBuilder {
		return new EmbedBuilder()
			.setTitle(this.t("Tickets.list.embed.title", locale))
			.setColor(Colors.Info)
			.addFields(
				ticketTypes.map((type) => ({
					name: `${type.emoji} ${type.name}`,
					value: type.description,
					inline: false,
				})),
			)
			.setFooter({
				text: this.t("Tickets.list.embed.footer", locale, {
					COUNT: ticketTypes.length.toString(),
				}),
				iconURL: this.client.user.displayAvatarURL(),
			})
			.setTimestamp();
	}
}
