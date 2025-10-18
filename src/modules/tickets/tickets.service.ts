import { Inject, Injectable } from "@nestjs/common";
import type { IGuildRepository } from "../database/repositories/interfaces";
import { Repositories } from "../database/types/constants";
import type { CreateTicketDTO, CreateTicketTypeDTO } from "./dto";
import type { TicketEntity, TicketTypeEntity } from "./entities";
import type { ITicketsRepository, ITicketsService } from "./interfaces";
import { CreateTicketTypeError, Tickets } from "./types/constants";

@Injectable()
export class TicketsService implements ITicketsService {
	public constructor(
		@Inject(Tickets.Repository) private readonly repository: ITicketsRepository,
		@Inject(Repositories.Guild)
		private readonly guildRepository: IGuildRepository,
	) {}

	public async createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity | CreateTicketTypeError> {
		const ticketTypeAlreadyExists = await this.getTicketType(dto.name);
		const countTicketTypes = await this.checkCount(dto.guildId);

		if (ticketTypeAlreadyExists) return CreateTicketTypeError.Exists;
		if (!countTicketTypes) return CreateTicketTypeError.Count;

		return await this.repository.createTicketType(dto);
	}

	public async getTicketTypes(guildId: string): Promise<TicketTypeEntity[]> {
		return await this.repository.getTicketTypes(guildId);
	}

	public async getTicketType(name: string): Promise<TicketTypeEntity> {
		return await this.repository.getTicketType(name);
	}

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		return await this.repository.createTicket(dto);
	}

	private async checkCount(guildId: string): Promise<boolean> {
		const isPremium = (await this.guildRepository.get(guildId)).Settings
			.Premium;
		const count = await this.repository.count(guildId);

		if (isPremium && count >= 12) {
			return false;
		}
		if (!isPremium && count >= 6) {
			return false;
		}
		return true;
	}
}
