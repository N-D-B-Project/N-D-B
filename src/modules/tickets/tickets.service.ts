import { Inject, Injectable } from "@nestjs/common";
import { ITicketsRepository, ITicketsService } from "./interfaces";
import { Tickets } from "./types/constants";
import { CreateTicketDTO, CreateTicketTypeDTO } from "./dto";
import { TicketEntity, TicketTypeEntity } from "./entities";

@Injectable()
export class TicketsService implements ITicketsService {
  public constructor(@Inject(Tickets.Repository) private readonly repository: ITicketsRepository) {}

  public async createTicketType(dto: CreateTicketTypeDTO): Promise<TicketTypeEntity> {
    return this.repository.createTicketType(dto);
  }

  public async getTicketTypes(guildId: string): Promise<TicketTypeEntity[]> {
    return this.repository.getTicketTypes(guildId);
  }

  public async getTicketType(name: string): Promise<TicketTypeEntity> {
    return this.repository.getTicketType(name);
  }

  public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
    return this.repository.createTicket(dto);
  }
}
