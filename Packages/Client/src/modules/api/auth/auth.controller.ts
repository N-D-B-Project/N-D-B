import { AuthUser } from "@/common/decorators/AuthUser.decorator";
import { DiscordAuthGuard } from "@/common/guards/Discord.guard";
import { JwtAuthGuard } from "@/common/guards/Jwt.guard";
import { Config } from "@/modules/shared/config/types";
import { UserEntity } from "@/modules/shared/database/entities";
import { Cookies, Routes, Services, isInProduction } from "@/types/Constants";
import { Controller, Get, HttpCode, HttpStatus, Inject, Redirect, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FastifyReply } from "fastify";
import { FastifyRequest } from "fastify";
import { IAuthService } from "./interfaces/IAuthService.interface";

@Controller(Routes.Auth)
export class AuthController {
	public constructor(
		@Inject(Services.Auth) private readonly authService: IAuthService,
		private readonly configService: ConfigService,
	) {}

	@Get("login")
	@UseGuards(DiscordAuthGuard)
	public login(): void {}

	@Get("redirect")
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(DiscordAuthGuard)
	@Redirect(isInProduction ? "http://localhost:4401/@me" : "http://localhost:4400/api/auth/status")
	public async redirect(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
		const jwt = await this.authService.login(req.user);
		res.cookie(Cookies.JWT, jwt, {
			httpOnly: true,
			maxAge: this.configService.getOrThrow<Config["API"]>("API").MaxAge,
		});
		return;
	}

	@Get("status")
	@UseGuards(JwtAuthGuard)
	public status(@AuthUser() user: UserEntity): UserEntity {
		return user;
	}
}
