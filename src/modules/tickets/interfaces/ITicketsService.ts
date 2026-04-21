import type { ConfigureTicketTypeDTO, CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import type { TicketEntity, TicketTypeEntity } from "../entities";
import type {
	CloseTicketError,
	ConfigureTicketTypeError,
	CreateTicketError,
	CreateTicketTypeError,
	DeleteTicketTypeError,
	PanelSettings,
} from "../types/constants";

export interface ITicketsService {
	createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity | CreateTicketTypeError>;
	getTicketTypes(guildId: string): Promise<TicketTypeEntity[]>;
	getTicketType(name: string): Promise<TicketTypeEntity>;
	getTicketTypeById(id: string): Promise<TicketTypeEntity>;
	configureTicketType(dto: ConfigureTicketTypeDTO): Promise<TicketTypeEntity | ConfigureTicketTypeError>;
	hasOpenTicket(userId: string, guildId: string, ticketTypeId: string): Promise<boolean>;
	createTicket(dto: CreateTicketDTO): Promise<TicketEntity>;
	closeTicket(channelId: string): Promise<TicketEntity | CloseTicketError>;
	deleteTicketType(name: string, guildId: string): Promise<TicketTypeEntity | DeleteTicketTypeError>;
	getPanelSettings(guildId: string): Promise<PanelSettings | null>;
	updatePanelSettings(guildId: string, data: Partial<PanelSettings>): Promise<unknown>;
	countTickets(guildId: string): Promise<number>;
}
