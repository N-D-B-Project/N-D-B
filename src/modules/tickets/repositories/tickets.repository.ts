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
		if (await this.checkCount(dto.guildId)) {
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

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		return this.prismaService.client.tickets.create({
			data: {
				userId: dto.userId,
				guildId: dto.guildId,
				ticketTypeId: (await this.getTicketType(dto.ticketTypeName)).id,
			},
		});
	}

	private async checkCount(guildId: string): Promise<boolean> {
		const isPremium = (await this.guildRepository.get(guildId)).Settings
			.Premium;
		const count = await this.prismaService.client.ticketType.count({
			where: {
				GuildSettings: {
					guildId,
				},
			},
		});

		if (isPremium && count >= 12) {
			return false;
		}
		if (!isPremium && count >= 6) {
			return false;
		}
		return true;
	}
}
