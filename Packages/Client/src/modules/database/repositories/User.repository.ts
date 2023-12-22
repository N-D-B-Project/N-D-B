import { DatabaseStatus } from "@/types";
import { Services } from "@/types/Constants";
import { IUserRepository } from "@/types/Interfaces";
import { Inject, Logger } from "@nestjs/common";
import { User } from "discord.js";
import { UserEntity } from "../entities";
import { PrismaService } from "../prisma/Prisma.service";

export class UserRepository implements IUserRepository {
	public constructor(@Inject(Services.Prisma) private readonly prisma: PrismaService) {}

	private readonly logger = new Logger(UserRepository.name);

	public async get(userId: string): Promise<UserEntity> {
		return await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				Settings: true,
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
				},
				include: {
					Settings: true,
				},
			})
			.catch((err) => {
				console.log(err);
				status = DatabaseStatus.Error;
			});
		this.logger.log(`${user.globalName} Configuration Crated on Database`);
		return {
			callback,
			status,
		};
	}

	public async update(oldUser: User, newUser: User): Promise<UserEntity> {
		throw new Error("Method not implemented.");
	}

	public async delete(user: User): Promise<UserEntity> {
		return await this.prisma.user.delete({
			where: { id: user.id },
			include: {
				Settings: true,
			},
		});
	}
}
