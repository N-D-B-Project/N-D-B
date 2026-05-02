import { APIUser, User, UserSettings } from "@ndb/database";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { User as DiscordUser } from "discord.js";
import type { Repository } from "typeorm";
import { DatabaseStatus } from "../types";
import type { IUserRepository } from "./interfaces";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		@InjectRepository(UserSettings)
		private readonly userSettingsRepo: Repository<UserSettings>,
		@InjectRepository(APIUser)
		private readonly apiUserRepo: Repository<APIUser>,
	) {}

	private readonly logger = new Logger(UserRepository.name);

	public async updateSettings(
		userId: string,
		data: Partial<UserSettings>,
	): Promise<void> {
		await this.userSettingsRepo.update({ userId }, data);
	}

	public async get(userId: string): Promise<User> {
		return await this.userRepo.findOne({
			where: { id: userId },
			relations: { settings: true, apiUser: true },
		});
	}

	public async getAll(): Promise<User[]> {
		return await this.userRepo.find({
			relations: { settings: true, apiUser: true },
		});
	}

	public async create(
		user: DiscordUser,
	): Promise<{ callback: User | undefined; status: DatabaseStatus }> {
		try {
			const newUser = this.userRepo.create({ id: user.id });
			const savedUser = await this.userRepo.save(newUser);
			const settings = this.userSettingsRepo.create({ userId: user.id });
			savedUser.settings = await this.userSettingsRepo.save(settings);
			const apiUser = this.apiUserRepo.create({
				userId: user.id,
				email: "",
				accessToken: "",
			});
			savedUser.apiUser = await this.apiUserRepo.save(apiUser);
			this.logger.log(`${user.username} Configuration Created on Database`);
			return { callback: savedUser, status: DatabaseStatus.Created };
		} catch (err) {
			this.logger.error(err);
			return { callback: undefined, status: DatabaseStatus.Error };
		}
	}

	public async update(user: DiscordUser): Promise<User> {
		return await this.get(user.id);
	}

	public async delete(user: DiscordUser): Promise<User> {
		const entity = await this.get(user.id);
		await this.userRepo.delete({ id: user.id });
		return entity;
	}
}
