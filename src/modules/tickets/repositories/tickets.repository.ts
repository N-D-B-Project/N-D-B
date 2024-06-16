import { PrismaService } from "@/modules/database/prisma/Prisma.service";
import { IGuildRepository } from "@/modules/database/repositories/interfaces";
import { Repositories } from "@/modules/database/types/constants";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { CreateTicketDTO, CreateTicketTypeDTO } from "../dto";
import { TicketTypeEntity, TicketEntity } from "../entities";
import { ITicketsRepository } from "../interfaces";

@Injectable()
export class TicketsRepository implements ITicketsRepository {
	public constructor(
		@Inject(Services.Prisma) private readonly prisma: PrismaService,
		@Inject(Repositories.Guild) private readonly GuildRepo: IGuildRepository,
	) {}

	public async createTicketType(dto: CreateTicketTypeDTO): Promise<TicketTypeEntity> {
		if (await this.checkCount(dto.guildId)) {
			return this.prisma.ticketType.create({
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
		return await this.prisma.ticketType.findMany({
			where: {
				GuildSettings: {
					guildId,
				},
			},
		});
	}

	public async getTicketType(name: string): Promise<TicketTypeEntity> {
		return await this.prisma.ticketType.findFirst({
			where: {
				name,
			},
		});
	}

	public async createTicket(dto: CreateTicketDTO): Promise<TicketEntity> {
		return this.prisma.tickets.create({
			data: {
				userId: dto.userId,
				guildId: dto.guildId,
				ticketTypeId: (await this.getTicketType(dto.ticketTypeName)).id,
			},
		});
	}

	private async checkCount(guildId: string): Promise<boolean> {
		const isPremium = (await this.GuildRepo.get(guildId)).Settings.Premium;
		const count = await this.prisma.ticketType.count({
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
