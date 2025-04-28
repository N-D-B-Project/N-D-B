import type { Config } from "@/modules/config/types";
import type { ConfigService } from "@nestjs/config";

export function EnvChecker(configService: ConfigService) {
	const DiscordConfig = configService.get<Config["Discord"]>("Discord");
	if (!DiscordConfig) {
		throw new Error("Discord config not found");
	}

	if (!DiscordConfig.Client.ID) {
		throw new Error("Client ID not found");
	}

	if (!DiscordConfig.Client.Secret) {
		throw new Error(
			`Client Secret not found | GET a token in https://discord.com/developers/applications/${DiscordConfig.Client.ID}/oauth2`,
		);
	}

	if (process.env.NODE_ENV === "PRODUCTION" && !DiscordConfig.Token) {
		throw new Error(
			`[PRODUCTION] Discord token not found | GET a token in https://discord.com/developers/applications/${DiscordConfig.Client.ID}/bot`,
		);
	}
	if (process.env.NODE_ENV === "DEVELOPMENT" && !DiscordConfig.DevToken) {
		throw new Error(
			"[DEVELOPMENT] Discord token not found | GET a token in https://discord.com/developers/applications/${config.Client.ID}/bot",
		);
	}

	if (!DiscordConfig.Client.CallbackURL) {
		throw new Error("Callback URL not found");
	}

	const DatabaseConfig = configService.get<Config["Database"]>("Database");

	if (!DatabaseConfig) {
		throw new Error("Database config not found");
	}

	if (!DatabaseConfig.URL) {
		throw new Error("Database URL not found");
	}

	if (!DatabaseConfig.Name) {
		throw new Error("Database Name not found");
	}

	if (!DatabaseConfig.Password) {
		throw new Error("Database Password not found");
	}

	// 	if (!DatabaseConfig.Redis) {
	// 		throw new Error("Redis config not found");
	// 	}

	// 	if (!DatabaseConfig.Redis.Host) {
	// 		throw new Error("Redis Host not found");
	// 	}

	// 	if (!DatabaseConfig.Redis.Port) {
	// 		throw new Error("Redis Port not found");
	// 	}

	const TopGGToken = configService.get<Config["TopGGToken"]>("TopGGToken");

	if (!TopGGToken) {
		throw new Error(
			`TopGG Token not found | GET a token in https://top.gg/bot/${DiscordConfig.Client.ID}/webhooks`,
		);
	}
}
