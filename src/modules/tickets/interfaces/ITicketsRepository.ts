import { CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import { TicketEntity, TicketTypeEntity } from "../entities";

export interface ITicketsRepository {
  createTicketType(dto: CreateTicketTypeDTO): Promise<TicketTypeEntity>
  getTicketTypes(guildId: string): Promise<TicketTypeEntity[]>
  getTicketType(name: string): Promise<TicketTypeEntity>
  createTicket(dto: CreateTicketDTO): Promise<TicketEntity>
}
