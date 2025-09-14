import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { CommandConfigGuard } from "../guards";

export interface CommandConfigOptions {
	category: string;
	disable: boolean;
}

export const CommandConfigKey = "discord::command::__config__";

export const CommandConfig = (options: CommandConfigOptions) => {
	return applyDecorators(
		SetMetadata(CommandConfigKey, options),
		UseGuards(CommandConfigGuard),
	);
};
