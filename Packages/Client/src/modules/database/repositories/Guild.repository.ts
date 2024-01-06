import { DatabaseStatus } from "@/types";
import { Services } from "@/types/Constants";
import { IGuildRepository } from "@/types/Interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Guild } from "discord.js";
import { GuildEntity } from "../entities";
import { PrismaService } from "../prisma/Prisma.service";

@Injectable()
export class GuildRepository implements IGuildRepository {
	public constructor(@Inject(Services.Prisma) private readonly prisma: PrismaService) {}

	private readonly logger = new Logger(GuildRepository.name);

	public async get(guildId: string): Promise<GuildEntity> {
		return await this.prisma.guild.findUnique({
			where: { id: guildId },
			include: {
				Settings: true,
			},
		});
	}

	public async create(guild: Guild): Promise<{ callback: void | GuildEntity; status: DatabaseStatus }> {
		let status = DatabaseStatus.Created;
		const callback = await this.prisma.guild
			.create({
				data: {
					id: guild.id,
					Name: guild.name,
					Settings: {
						create: {},
					},
				},
				include: {
					Settings: true,
				},
			})
			.catch((err) => {
				this.logger.error(err);
				status = DatabaseStatus.Error;
			});
		this.logger.log(`${guild.name} Configuration Crated on Database`);
		return {
			callback,
			status,
		};
	}

	public async update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity> {
		return await this.prisma.guild.update({
			where: { id: oldGuild.id },
			data: {
				Name: newGuild.name,
				updatedAt: new Date(),
			},
			include: {
				Settings: true,
			},
		});
	}

	public async delete(guild: Guild): Promise<GuildEntity> {
		return await this.prisma.guild.delete({
			where: { id: guild.id },
			include: {
				Settings: true,
			},
		});
	}

	public async getCreated(guild: Guild): Promise<GuildEntity> {
		await this.create(guild).then(({ status }) => {
			if (status === DatabaseStatus.Created) {
				this.logger.log(`${guild.name} Configuration Crated on Database`);
			}
		});
		return await this.get(guild.id);
	}
}
