import { Inject, Injectable } from "@nestjs/common";
import type { IGuildRepository } from "../database/repositories/interfaces";
import { Repositories } from "../database/types/constants";
import type { ConfigureTicketTypeDTO, CreateTicketDTO, CreateTicketTypeDTO } from "./dto";
import type { TicketEntity, TicketTypeEntity } from "./entities";
import type { ITicketsRepository, ITicketsService } from "./interfaces";
import {
	CloseTicketError,
	ConfigureTicketTypeError,
	CreateTicketError,
	CreateTicketTypeError,
	DeleteTicketTypeError,
	Tickets,
} from "./types/constants";

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

	public async getTicketTypeById(id: string): Promise<TicketTypeEntity> {
		return await this.repository.getTicketTypeById(id);
	}

	public async configureTicketType(
		dto: ConfigureTicketTypeDTO,
	): Promise<TicketTypeEntity | ConfigureTicketTypeError> {
		const ticketType = await this.repository.getTicketType(dto.name);

		if (!ticketType) return ConfigureTicketTypeError.NotFound;

		const data: Partial<Pick<TicketTypeEntity, "supportRoleId" | "categoryId" | "description" | "message" | "emoji">> = {};
		if (dto.supportRoleId !== undefined) data.supportRoleId = dto.supportRoleId;
		if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
		if (dto.description !== undefined) data.description = dto.description;
		if (dto.message !== undefined) data.message = dto.message;
		if (dto.emoji !== undefined) data.emoji = dto.emoji;

		return await this.repository.updateTicketType(ticketType.id, data);
	}

	public async hasOpenTicket(
		userId: string,
		guildId: string,
		ticketTypeId: string,
	): Promise<boolean> {
		const existing = await this.repository.getOpenTicket(
			userId,
			guildId,
			ticketTypeId,
		);
		return !!existing;
	}

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		return await this.repository.createTicket(dto);
	}

	public async closeTicket(
		channelId: string,
	): Promise<TicketEntity | CloseTicketError> {
		const ticket = await this.repository.getTicketByChannelId(channelId);

		if (!ticket) return CloseTicketError.NotInTicketChannel;

		return await this.repository.closeTicket(ticket.id);
	}

	public async deleteTicketType(
		name: string,
		guildId: string,
	): Promise<TicketTypeEntity | DeleteTicketTypeError> {
		const ticketType = await this.repository.getTicketType(name);

		if (!ticketType) return DeleteTicketTypeError.NotFound;

		return await this.repository.deleteTicketType(ticketType.id);
	}

	public async getPanelSettings(guildId: string) {
		return await this.repository.getPanelSettings(guildId);
	}

	public async updatePanelSettings(
		guildId: string,
		data: Partial<import("./types/constants").PanelSettings>,
	) {
		return await this.repository.updatePanelSettings(guildId, data);
	}

	public async countTickets(guildId: string): Promise<number> {
		return await this.repository.countTickets(guildId);
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
