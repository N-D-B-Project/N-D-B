import { Injectable, Logger } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type { Guild } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PrismaService } from "nestjs-prisma";
import type { GuildEntity } from "../entities";
import { DatabaseStatus } from "../types";
import type { IGuildRepository } from "./interfaces";

@Injectable()
export class GuildRepository implements IGuildRepository {
	public constructor(private readonly prisma: PrismaService) {}

	private readonly logger = new Logger(GuildRepository.name);

	public guildSettings(): Prisma.GuildSettingsDelegate<DefaultArgs> {
		return this.prisma.guildSettings;
	}

	public async get(guildId: string): Promise<GuildEntity> {
		return await this.prisma.guild.findUnique({
			where: { id: guildId },
			include: {
				Settings: true,
			},
		});
	}

	public async getAll(): Promise<GuildEntity[]> {
		return await this.prisma.guild.findMany({
			include: {
				Settings: true,
			},
		});
	}

	public async create(
		guild: Guild,
		// biome-ignore lint/suspicious/noConfusingVoidType: <Prisma returns void if no data is returned>
	): Promise<{ callback: GuildEntity | void; status: DatabaseStatus }> {
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
		this.logger.log(`${guild.name} Configuration Created on Database`);
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
