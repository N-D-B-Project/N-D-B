import { UserDTO } from "@/modules/api/user/user.dto";
import { Services } from "@/types/Constants";
import { Inject } from "@nestjs/common";
import { UserEntity } from "../entities";
import { PrismaService } from "../prisma/Prisma.service";
import type { IAPIUserRepository } from "./interfaces/IAPIUserRepository";

export class APIUserRepository implements IAPIUserRepository {
	public constructor(@Inject(Services.Prisma) private readonly prisma: PrismaService) {}

	public async get(userId: string): Promise<UserEntity> {
		return await this.prisma.user.findFirst({
			where: {
				id: userId,
			},
			include: {
				APIUser: true,
				Settings: true,
			},
		});
	}

	public async create(userDTO: UserDTO): Promise<UserEntity> {
		return await this.prisma.user.create({
			data: {
				id: userDTO.id,
				Settings: {
					create: {},
				},
				APIUser: {
					create: {
						email: userDTO.email,
						accessToken: userDTO.accessToken,
					},
				},
			},
			include: {
				APIUser: true,
				Settings: true,
			},
		});
	}

	public async update(userDTO: UserDTO): Promise<UserEntity> {
		return await this.prisma.user.update({
			where: { id: userDTO.id },
			data: {
				APIUser: {
					update: {
						email: userDTO.email,
						accessToken: userDTO.accessToken,
					},
				},
			},
			include: {
				APIUser: true,
				Settings: true,
			},
		});
	}
}
