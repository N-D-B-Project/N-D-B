import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Guild, GuildSettings } from "@ndb/database";
import type { Guild as DiscordGuild } from "discord.js";
import { Repository } from "typeorm";
import { DatabaseStatus } from "../types";
import type { IGuildRepository } from "./interfaces";

@Injectable()
export class GuildRepository implements IGuildRepository {
	public constructor(
		@InjectRepository(Guild)
		private readonly guildRepo: Repository<Guild>,
		@InjectRepository(GuildSettings)
		private readonly guildSettingsRepo: Repository<GuildSettings>,
	) {}

	private readonly logger = new Logger(GuildRepository.name);

	public async updateSettings(guildId: string, data: Partial<GuildSettings>): Promise<void> {
		await this.guildSettingsRepo.update({ guildId }, data);
	}

	public async get(guildId: string): Promise<Guild> {
		return await this.guildRepo.findOne({
			where: { id: guildId },
			relations: { settings: true },
		});
	}

	public async getAll(): Promise<Guild[]> {
		return await this.guildRepo.find({
			relations: { settings: true },
		});
	}

	public async create(
		guild: DiscordGuild,
	): Promise<{ callback: Guild | undefined; status: DatabaseStatus }> {
		try {
			const newGuild = this.guildRepo.create({ id: guild.id, name: guild.name });
			const savedGuild = await this.guildRepo.save(newGuild);
			const settings = this.guildSettingsRepo.create({ guildId: guild.id });
			savedGuild.settings = await this.guildSettingsRepo.save(settings);
			this.logger.log(`${guild.name} Configuration Created on Database`);
			return { callback: savedGuild, status: DatabaseStatus.Created };
		} catch (err) {
			this.logger.error(err);
			return { callback: undefined, status: DatabaseStatus.Error };
		}
	}

	public async update(oldGuild: DiscordGuild, newGuild: DiscordGuild): Promise<Guild> {
		await this.guildRepo.update({ id: oldGuild.id }, { name: newGuild.name });
		return await this.get(oldGuild.id);
	}

	public async delete(guild: DiscordGuild): Promise<Guild> {
		const entity = await this.get(guild.id);
		await this.guildRepo.delete({ id: guild.id });
		return entity;
	}
}
