import type { EmbedBuilder, User } from "discord.js";

export interface TicketTypeData {
	id: string;
	name: string;
	description: string;
	emoji: string;
	message?: string | null;
}

export interface ITicketsEmbeds {
	SelectTypeEmbed(locale: string): EmbedBuilder;
	ConfirmTypeEmbed(locale: string, ticketType: TicketTypeData): EmbedBuilder;
	OpenTicketEmbed(
		locale: string,
		ticketType: TicketTypeData,
		message: string,
	): EmbedBuilder;
	CloseTicketEmbed(locale: string, user: User): EmbedBuilder;
	ListTypesEmbed(locale: string, ticketTypes: TicketTypeData[]): EmbedBuilder;
}
