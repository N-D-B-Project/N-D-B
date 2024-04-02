import { Config } from "@/modules/config/types";
import { UserEntity } from "@/modules/database/entities";
import { Cookies, Services } from "@/types/Constants";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyRequest } from "fastify";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IAuthService } from "../interfaces/IAuthService.interface";
import { JwtPayload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "JWT") {
	constructor(
		@Inject(Services.Auth) private readonly authService: IAuthService,
		private readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: FastifyRequest) => {
					const data = request?.cookies[Cookies.JWT];
					return data ? data : undefined;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<Config["API"]>("API").JwtSecret,
		});
	}

	async validate(payload: JwtPayload): Promise<UserEntity> {
		const user = await this.authService.get(payload);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
