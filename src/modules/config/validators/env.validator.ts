import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvDTO } from "../dtos/env.dto";

export function envValidator(
	config: Record<string, string | number | boolean | undefined>,
): EnvDTO {
	const validatedConfig = plainToInstance(EnvDTO, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
		forbidUnknownValues: true,
	});

	if (errors.length > 0) {
		throw new Error(
			`\n${errors.map((err) => `${JSON.stringify(err.constraints, null, 2)}\n`)}`,
		);
	}

	return validatedConfig;
}
