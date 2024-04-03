import { Config } from "@/modules/shared/config/types";
import { Services } from "@/types/Constants";
import { Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DiscordStrategy, JwtStrategy } from "./strategies";

const provider: Provider<AuthService> = {
	provide: Services.Auth,
	useClass: AuthService,
};

@Module({
	imports: [
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				secret: config.getOrThrow<Config["API"]>("API").JwtSecret,
				signOptions: {
					expiresIn: config.getOrThrow<Config["API"]>("API").JwtExpire,
				},
			}),
		}),
		PassportModule.register({
			session: true,
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [provider, DiscordStrategy, JwtStrategy],
	exports: [provider],
})
export class AuthModule {}
