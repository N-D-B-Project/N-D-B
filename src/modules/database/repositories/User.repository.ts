import { Services } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import type { User } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { CustomPrismaService } from "nestjs-prisma";
import type { UserEntity } from "../entities";
import type { ExtendedPrismaClient } from "../prisma.client";
import { DatabaseStatus } from "../types";
import type { IUserRepository } from "./interfaces";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
	) {}

	private readonly logger = new Logger(UserRepository.name);

	public userSettings() {
		return this.prisma.client.userSettings;
	}

	public async get(userId: string): Promise<UserEntity> {
		return await this.prisma.client.user.findUnique({
			where: { id: userId },
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}

	public async getAll(): Promise<UserEntity[]> {
		return await this.prisma.client.user.findMany({
			include: {
				APIUser: true,
				Settings: true,
			},
		});
	}

	public async create(
		user: User,
	): Promise<{ callback: UserEntity | undefined; status: DatabaseStatus }> {
		return await this.prisma.client.client.user
			.create({
				data: {
					id: user.id,
					Settings: {
						create: {},
					},
					APIUser: {
						create: {
							accessToken: "",
							email: "",
						},
					},
				},
				include: {
					Settings: true,
				},
			})
			.then((data: UserEntity) => {
				this.logger.log(`${user.username} Configuration Created on Database`);
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

	public async update(user: User): Promise<UserEntity> {
		return await this.prisma.client.user.update({
			where: { id: user.id },
			data: {},
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}

	public async delete(user: User): Promise<UserEntity> {
		return await this.prisma.client.user.delete({
			where: { id: user.id },
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}
}
