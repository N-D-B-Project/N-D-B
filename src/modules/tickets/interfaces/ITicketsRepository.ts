import type { ConfigureTicketTypeDTO, CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import type { TicketEntity, TicketTypeEntity } from "../entities";
import type { CreateTicketTypeError, PanelSettings } from "../types/constants";

export interface ITicketsRepository {
	createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity | CreateTicketTypeError>;
	getTicketTypes(guildId: string): Promise<TicketTypeEntity[]>;
	getTicketType(name: string): Promise<TicketTypeEntity>;
	getTicketTypeById(id: string): Promise<TicketTypeEntity>;
	updateTicketType(id: string, data: Partial<Pick<TicketTypeEntity, "supportRoleId" | "categoryId" | "description" | "message" | "emoji">>): Promise<TicketTypeEntity>;
	createTicket(dto: CreateTicketDTO): Promise<TicketEntity>;
	getOpenTicket(userId: string, guildId: string, ticketTypeId: string): Promise<TicketEntity>;
	getTicketByChannelId(channelId: string): Promise<TicketEntity>;
	closeTicket(id: string): Promise<TicketEntity>;
	deleteTicketType(id: string): Promise<TicketTypeEntity>;
	getPanelSettings(guildId: string): Promise<PanelSettings | null>;
	updatePanelSettings(guildId: string, data: Partial<PanelSettings>): Promise<unknown>;
	count(guildId: string): Promise<number>;
	countTickets(guildId: string): Promise<number>;
}
