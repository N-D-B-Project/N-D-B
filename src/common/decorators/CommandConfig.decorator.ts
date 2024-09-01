import { Reflector } from "@nestjs/core";

export interface CommandConfigOptions {
	category: string;
	disable: boolean;
}

export const CommandConfig = Reflector.createDecorator<CommandConfigOptions>();
