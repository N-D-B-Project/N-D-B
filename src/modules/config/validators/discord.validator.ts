import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { discordConfig } from "../configurations";
import { DiscordDTO } from "../dtos/discord.dto";

export function discordValidator(): DiscordDTO {
	const validatedConfig = plainToInstance(DiscordDTO, discordConfig, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, {
		whitelist: true,
		forbidNonWhitelisted: true,
	});

	if (errors.length > 0) {
		throw new Error(
			`\n${errors.map((err) => `${JSON.stringify(err.constraints, null, 2)}\n`)}`,
		);
	}

	return validatedConfig;
}
