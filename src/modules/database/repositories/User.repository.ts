import { Services } from "@/types/Constants";
import { Inject, Logger } from "@nestjs/common";
import { User } from "discord.js";
import { UserEntity } from "../entities";
import { PrismaService } from "../prisma/Prisma.service";
import { DatabaseStatus } from "../types";
import type { IUserRepository } from "./interfaces";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class UserRepository implements IUserRepository {
	public constructor(@Inject(Services.Prisma) private readonly prisma: PrismaService) {}
  
	private readonly logger = new Logger(UserRepository.name);

  public userSettings(): Prisma.UserSettingsDelegate<DefaultArgs> {
    return this.prisma.userSettings
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
				Settings: true,
				APIUser: true,
			},
		});
  }

	public async create(user: User): Promise<{ callback: UserEntity | void; status: DatabaseStatus }> {
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
