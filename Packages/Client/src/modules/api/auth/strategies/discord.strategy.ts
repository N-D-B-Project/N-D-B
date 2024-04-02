import { AuthService } from "@/modules/api/auth/auth.service";
import { Config } from "@/modules/config/types";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-discord";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "Discord") {
	constructor(
		@Inject(Services.Auth) private readonly authService: AuthService,
		private readonly config: ConfigService,
	) {
		const Configs = config.getOrThrow<Config["Discord"]>("Discord").Client;
		super({
			clientID: Configs.ID,
			clientSecret: Configs.Secret,
			callbackURL: Configs.CallbackURL,
			scope: ["identify", "guilds", "email"],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		const { username, id, avatar, email } = profile;
		const details = {
			username,
			id,
			avatar,
			email,
			accessToken,
			refreshToken,
		};
		return await this.authService.validateUser(details);
	}
}
