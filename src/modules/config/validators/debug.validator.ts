import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { debugConfig } from "../configurations";
import { DebugDTO } from "../dtos/debug.dto";

export function debugValidator(): DebugDTO {
	const validatedConfig = plainToInstance(DebugDTO, debugConfig, {
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
