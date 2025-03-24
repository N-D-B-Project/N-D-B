import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { musicConfig } from "../configurations";
import { MusicDTO } from "../dtos/music.dto";

export function musicValidator(): MusicDTO {
	const validatedConfig = plainToInstance(MusicDTO, musicConfig, {
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
