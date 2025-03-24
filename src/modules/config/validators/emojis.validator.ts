import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { emojisConfig } from "../configurations";
import { EmojisDTO } from "../dtos/emojis.dto";

export function emojisValidator(): EmojisDTO {
	const validatedConfig = plainToInstance(EmojisDTO, emojisConfig, {
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
