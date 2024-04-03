import { UserEntity } from "@/modules/shared/database/entities";
import { IAPIUserRepository } from "@/modules/shared/database/repositories/interfaces/IAPIUserRepository";
import { Repositories } from "@/modules/shared/database/types/constants";
import { Inject, Injectable } from "@nestjs/common";
import { IUserService } from "./interfaces/IUserService";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService implements IUserService {
	public constructor(@Inject(Repositories.APIUser) private readonly apiUserRepo: IAPIUserRepository) {}

	public async get(userId: string): Promise<UserEntity> {
		return await this.apiUserRepo.get(userId);
	}

	public async create(details: UserDTO): Promise<UserEntity> {
		const user = await this.get(details.id);
		if (!user) {
			await this.apiUserRepo.create(details);
		}
		return user ? user : await this.get(details.id);
	}

	public async update(details: UserDTO): Promise<UserEntity> {
		return await this.apiUserRepo.update(details);
	}
}
