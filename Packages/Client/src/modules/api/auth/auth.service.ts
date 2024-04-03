import { UserEntity } from "@/modules/shared/database/entities";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUserService } from "../user/interfaces/IUserService";
import { UserDTO } from "../user/user.dto";
import { IAuthService } from "./interfaces/IAuthService.interface";
import { JwtPayload } from "./types";

@Injectable()
export class AuthService implements IAuthService {
	public constructor(
		@Inject(Services.User) private readonly userService: IUserService,
		private readonly jwtService: JwtService,
	) {}

	public async validateUser(details: UserDTO): Promise<UserEntity> {
		const user = await this.userService.get(details.id);
		return user ? await this.userService.update(details) : ((await this.userService.create(details)) as UserEntity);
	}

	public async get(payload: JwtPayload) {
		const user = await this.userService.get(payload.id);
		return user;
	}

	public async login(payload: JwtPayload): Promise<string> {
		const token = await this.jwtService.signAsync({ payload });
		return token;
	}
}
