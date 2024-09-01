import {
	LOCALIZATION_ADAPTER,
	type NestedLocalizationAdapter,
} from "@necord/localization";
import {
	type CanActivate,
	type ExecutionContext,
	Inject,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ChatInputCommandInteraction } from "discord.js";
import { NecordExecutionContext } from "necord";
import { CommandConfigKey } from "../decorators";

@Injectable()
export class CommandConfigGuard implements CanActivate {
	public constructor(
		@Inject(LOCALIZATION_ADAPTER)
		private readonly translate: NestedLocalizationAdapter,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(
		executionContext: ExecutionContext,
	): Promise<boolean> {
		const commandConfig = this.reflector.get(
			CommandConfigKey,
			executionContext.getHandler(),
		);
		const context = NecordExecutionContext.create(executionContext);
		const args = context.getArgByIndex(0);
		const interaction = args[0] as ChatInputCommandInteraction;

		if (commandConfig.disable) {
			interaction.reply(
				this.translate.getTranslation(
					"Tools.Command.Checker.Disable",
					interaction.guildLocale,
				),
			);
			return false;
		}

		return true;
	}
}
