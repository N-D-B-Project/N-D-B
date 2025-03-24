import { Services } from "@/types/Constants";
import { Global, Module, type Provider } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";
import {
	debugValidator,
	discordValidator,
	emojisValidator,
	envValidator,
	musicValidator,
} from "./validators";

const providers: Provider[] = [
	{ provide: Services.Config, useClass: ConfigService },
];

@Global()
@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: false,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			load: [debugValidator, discordValidator, emojisValidator, musicValidator],
			validate: envValidator,
		}),
	],
	providers: [...providers],
	exports: [...providers],
})
export class ConfigModule {}
