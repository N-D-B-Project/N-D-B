import { Injectable, Logger } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type { User } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { PrismaService } from "nestjs-prisma";
import type { UserEntity } from "../entities";
import { DatabaseStatus } from "../types";
import type { IUserRepository } from "./interfaces";

@Injectable()
export class UserRepository implements IUserRepository {
	public constructor(private readonly prisma: PrismaService) {}

	private readonly logger = new Logger(UserRepository.name);

	public userSettings(): Prisma.UserSettingsDelegate<DefaultArgs> {
		return this.prisma.userSettings;
	}

	public async get(userId: string): Promise<UserEntity> {
		return await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}

	public async getAll(): Promise<UserEntity[]> {
		return await this.prisma.user.findMany({
			include: {
				APIUser: true,
				Settings: true,
			},
		});
	}

	public async create(
		user: User,
		// biome-ignore lint/suspicious/noConfusingVoidType: <Prisma returns void if no data is returned>
	): Promise<{ callback: UserEntity | void; status: DatabaseStatus }> {
		let status = DatabaseStatus.Created;
		const callback = await this.prisma.user
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
			.catch((err) => {
				this.logger.error(err);
				status = DatabaseStatus.Error;
			});
		this.logger.log(`${user.username} Configuration Created on Database`);
		return {
			callback,
			status,
		};
	}

	public async update(user: User): Promise<UserEntity> {
		return await this.prisma.user.update({
			where: { id: user.id },
			data: {},
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}

	public async delete(user: User): Promise<UserEntity> {
		return await this.prisma.user.delete({
			where: { id: user.id },
			include: {
				Settings: true,
				APIUser: true,
			},
		});
	}
}
