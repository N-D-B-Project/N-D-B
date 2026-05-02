import {
	GuildSettings,
	GuildTicketsStatus,
	Tickets,
	TicketType,
} from "@ndb/database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import type { CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import type { TicketEntity, TicketTypeEntity } from "../entities";
import type { ITicketsRepository } from "../interfaces";
import type { PanelSettings } from "../types/constants";

@Injectable()
export class TicketsRepository implements ITicketsRepository {
	public constructor(
		@InjectRepository(Tickets)
		private readonly ticketsRepo: Repository<Tickets>,
		@InjectRepository(TicketType)
		private readonly ticketTypeRepo: Repository<TicketType>,
		@InjectRepository(GuildSettings)
		private readonly guildSettingsRepo: Repository<GuildSettings>,
	) {}

	public async createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity> {
		const settings = await this.guildSettingsRepo.findOne({
			where: { guildId: dto.guildId },
		});
		return await this.ticketTypeRepo.save(
			this.ticketTypeRepo.create({
				name: dto.name,
				description: dto.description,
				emoji: dto.emoji,
				message: dto.message,
				guildSettingsId: settings?.id ?? null,
			}),
		);
	}

	public async getTicketTypes(guildId: string): Promise<TicketTypeEntity[]> {
		return await this.ticketTypeRepo.find({
			where: { guildSettings: { guildId } },
		});
	}

	public async getTicketType(name: string): Promise<TicketTypeEntity> {
		return await this.ticketTypeRepo.findOne({ where: { name } });
	}

	public async getTicketTypeById(id: string): Promise<TicketTypeEntity> {
		return await this.ticketTypeRepo.findOne({ where: { id } });
	}

	public async updateTicketType(
		id: string,
		data: Partial<
			Pick<
				TicketTypeEntity,
				"supportRoleId" | "categoryId" | "description" | "message" | "emoji"
			>
		>,
	): Promise<TicketTypeEntity> {
		await this.ticketTypeRepo.update({ id }, data);
		return await this.getTicketTypeById(id);
	}

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		const ticketType = await this.getTicketType(dto.ticketTypeName);
		return await this.ticketsRepo.save(
			this.ticketsRepo.create({
				channelId: dto.channelId,
				userId: dto.userId,
				guildId: dto.guildId,
				ticketTypeId: ticketType.id,
				status: GuildTicketsStatus.OPEN,
			}),
		);
	}

	public async getOpenTicket(
		userId: string,
		guildId: string,
		ticketTypeId: string,
	): Promise<TicketEntity> {
		return await this.ticketsRepo.findOne({
			where: { userId, guildId, ticketTypeId, status: GuildTicketsStatus.OPEN },
		});
	}

	public async getTicketByChannelId(channelId: string): Promise<TicketEntity> {
		return await this.ticketsRepo.findOne({
			where: { channelId, status: GuildTicketsStatus.OPEN },
		});
	}

	public async closeTicket(id: string): Promise<TicketEntity> {
		await this.ticketsRepo.update(
			{ id },
			{ status: GuildTicketsStatus.CLOSED },
		);
		return await this.ticketsRepo.findOne({ where: { id } });
	}

	public async deleteTicketType(id: string): Promise<TicketTypeEntity> {
		const entity = await this.getTicketTypeById(id);
		await this.ticketTypeRepo.delete({ id });
		return entity;
	}

	public async count(guildId: string): Promise<number> {
		return await this.ticketTypeRepo.count({
			where: { guildSettings: { guildId } },
		});
	}

	public async getPanelSettings(guildId: string): Promise<PanelSettings> {
		return await this.guildSettingsRepo.findOne({
			where: { guildId },
			select: {
				ticketPanelTitle: true,
				ticketPanelDesc: true,
				ticketPanelColor: true,
				ticketPanelThumbnail: true,
				ticketPanelImage: true,
				ticketPanelFooter: true,
				ticketPanelBtnLabel: true,
				ticketPanelBtnEmoji: true,
				ticketDefaultRole: true,
				ticketDefaultCategory: true,
				ticketDefaultMessage: true,
			},
		});
	}

	public async updatePanelSettings(
		guildId: string,
		data: Partial<PanelSettings>,
	): Promise<void> {
		await this.guildSettingsRepo.update({ guildId }, data);
	}

	public async countTickets(guildId: string): Promise<number> {
		return await this.ticketsRepo.count({ where: { guildId } });
	}
}
