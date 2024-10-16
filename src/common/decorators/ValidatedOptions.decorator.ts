import { type PipeTransform, ValidationPipe } from "@nestjs/common";
import { Options } from "necord";

export const ValidatedOptions = (
	...dataOrPipes: PipeTransform[] | string[]
) => {
	return Options(
		...dataOrPipes,
		new ValidationPipe({ validateCustomDecorators: true }),
	);
};
