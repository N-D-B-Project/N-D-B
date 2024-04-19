import { Reflector } from "@nestjs/core";

interface CommandConfigOptions {
	category: string;
	disable: boolean;
}

export const CommandConfig = Reflector.createDecorator<CommandConfigOptions>();
