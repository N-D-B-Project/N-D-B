import type { CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import type { TicketEntity, TicketTypeEntity } from "../entities";
import type { CreateTicketTypeError } from "../types/constants";

export interface ITicketsRepository {
	createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity | CreateTicketTypeError>;
	getTicketTypes(guildId: string): Promise<TicketTypeEntity[]>;
	getTicketType(name: string): Promise<TicketTypeEntity>;
	createTicket(dto: CreateTicketDTO): Promise<TicketEntity>;
	count(guildId: string): Promise<number>;
}
