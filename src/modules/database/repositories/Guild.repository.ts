import { DatabaseStatus, type IGuildRepository, Services } from "@/types";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Guild } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { CustomPrismaService } from "nestjs-prisma";
import type { GuildEntity } from "../entities";
import type { ExtendedPrismaClient } from "../prisma.client";

@Injectable()
export class GuildRepository implements IGuildRepository {
	public constructor(
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
	) {}

	private readonly logger = new Logger(GuildRepository.name);

	public guildSettings() {
		return this.prisma.client.guildSettings;
	}

	public async get(guildId: string): Promise<GuildEntity> {
		return await this.prisma.client.guild.findUnique({
			where: { id: guildId },
			include: {
				Settings: true,
			},
		});
	}

	public async getAll(): Promise<GuildEntity[]> {
		return await this.prisma.client.guild.findMany({
			include: {
				Settings: true,
			},
		});
	}

	public async create(
		guild: Guild,
	): Promise<{ callback: GuildEntity | undefined; status: DatabaseStatus }> {
		return await this.prisma.client.guild
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
			.then((data: GuildEntity) => {
				this.logger.log(`${guild.name} Configuration Created on Database`);
				return {
					callback: data,
					status: DatabaseStatus.Created,
				};
			})
			.catch((err) => {
				this.logger.error(err);
				return {
					callback: undefined,
					status: DatabaseStatus.Error,
				};
			});
	}

	public async update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity> {
		return await this.prisma.client.guild.update({
			where: { id: oldGuild.id },
			data: {
				Name: newGuild.name,
			},
			include: {
				Settings: true,
			},
		});
	}

	public async delete(guild: Guild): Promise<GuildEntity> {
		return await this.prisma.client.guild.delete({
			where: { id: guild.id },
			include: {
				Settings: true,
			},
		});
	}
}
