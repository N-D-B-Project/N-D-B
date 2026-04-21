import { Inject, Injectable } from "@nestjs/common";
import type { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "@/modules/database/prisma.client";
import type { IGuildRepository } from "@/modules/database/repositories/interfaces";
import { Repositories } from "@/modules/database/types/constants";
import { Services } from "@/types/Constants";
import type { CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import type { TicketEntity, TicketTypeEntity } from "../entities";
import type { ITicketsRepository } from "../interfaces";

@Injectable()
export class TicketsRepository implements ITicketsRepository {
	public constructor(
		@Inject(Services.Prisma)
		readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
		@Inject(Repositories.Guild) readonly guildRepository: IGuildRepository,
	) {}

	public async createTicketType(
		dto: CreateTicketTypeDTO,
	): Promise<TicketTypeEntity> {
		return this.prismaService.client.ticketType.create({
			data: {
				description: dto.description,
				emoji: dto.emoji,
				message: dto.message,
				name: dto.name,
				GuildSettings: {
					connect: {
						guildId: dto.guildId,
					},
				},
			},
		});
	}

	public async getTicketTypes(guildId: string): Promise<TicketTypeEntity[]> {
		return await this.prismaService.client.ticketType.findMany({
			where: {
				GuildSettings: {
					guildId,
				},
			},
		});
	}

	public async getTicketType(name: string): Promise<TicketTypeEntity> {
		return await this.prismaService.client.ticketType.findFirst({
			where: {
				name,
			},
		});
	}

	public async getTicketTypeById(id: string): Promise<TicketTypeEntity> {
		return await this.prismaService.client.ticketType.findUnique({
			where: { id },
		});
	}

	public async updateTicketType(
		id: string,
		data: Partial<Pick<TicketTypeEntity, "supportRoleId" | "categoryId" | "description" | "message" | "emoji">>,
	): Promise<TicketTypeEntity> {
		return await this.prismaService.client.ticketType.update({
			where: { id },
			data,
		});
	}

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		return this.prismaService.client.tickets.create({
			data: {
				channelId: dto.channelId,
				User: {
					connectOrCreate: {
						where: { id: dto.userId },
						create: { id: dto.userId },
					},
				},
				Guild: {
					connectOrCreate: {
						where: { id: dto.guildId },
						create: { id: dto.guildId, Name: dto.guildId },
					},
				},
				TicketType: {
					connect: {
						id: (await this.getTicketType(dto.ticketTypeName)).id,
					},
				},
			},
		});
	}

	public async getOpenTicket(
		userId: string,
		guildId: string,
		ticketTypeId: string,
	): Promise<TicketEntity> {
		return await this.prismaService.client.tickets.findFirst({
			where: {
				userId,
				guildId,
				ticketTypeId,
				status: "OPEN",
			},
		});
	}

	public async getTicketByChannelId(channelId: string): Promise<TicketEntity> {
		return await this.prismaService.client.tickets.findFirst({
			where: {
				channelId,
				status: "OPEN",
			},
		});
	}

	public async closeTicket(id: string): Promise<TicketEntity> {
		return await this.prismaService.client.tickets.update({
			where: { id },
			data: { status: "CLOSED" },
		});
	}

	public async deleteTicketType(id: string): Promise<TicketTypeEntity> {
		return await this.prismaService.client.ticketType.delete({
			where: { id },
		});
	}

	public async count(guildId: string): Promise<number> {
		return await this.prismaService.client.ticketType.count({
			where: {
				GuildSettings: {
					guildId,
				},
			},
		});
	}

	public async getPanelSettings(guildId: string) {
		const settings = await this.prismaService.client.guildSettings.findUnique({
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
		return settings;
	}

	public async updatePanelSettings(
		guildId: string,
		data: Partial<import("../types/constants").PanelSettings>,
	) {
		return await this.prismaService.client.guildSettings.update({
			where: { guildId },
			data,
		});
	}

	public async countTickets(guildId: string): Promise<number> {
		return await this.prismaService.client.tickets.count({
			where: { guildId },
		});
	}
}
