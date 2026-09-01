import type { CreateTicketDTO, CreateTicketTypeDTO } from "../dto/index.js";
import type { TicketEntity, TicketTypeEntity } from "../entities/index.js";
import type {
	CreateTicketTypeError,
	PanelSettings,
} from "../types/constants.js";

export interface ITicketsRepository {
	createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity | CreateTicketTypeError>;
	getTicketTypes(guildId: string): Promise<TicketTypeEntity[]>;
	getTicketType(name: string): Promise<TicketTypeEntity>;
	getTicketTypeById(id: string): Promise<TicketTypeEntity>;
	updateTicketType(
		id: string,
		data: Partial<
			Pick<
				TicketTypeEntity,
				"supportRoleId" | "categoryId" | "description" | "message" | "emoji"
			>
		>,
	): Promise<TicketTypeEntity>;
	createTicket(dto: CreateTicketDTO): Promise<TicketEntity>;
	getOpenTicket(
		userId: string,
		guildId: string,
		ticketTypeId: string,
	): Promise<TicketEntity>;
	getTicketByChannelId(channelId: string): Promise<TicketEntity>;
	closeTicket(id: string): Promise<TicketEntity>;
	deleteTicketType(id: string): Promise<TicketTypeEntity>;
	getPanelSettings(guildId: string): Promise<PanelSettings | null>;
	updatePanelSettings(
		guildId: string,
		data: Partial<PanelSettings>,
	): Promise<void>;
	count(guildId: string): Promise<number>;
	countTickets(guildId: string): Promise<number>;
}
