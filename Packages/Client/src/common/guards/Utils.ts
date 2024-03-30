import { Context } from "@/modules/bot/commands/Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "@/modules/bot/commands/Commands.discovery";
import { Content } from "@/modules/bot/commands/types";
import { ExecutionContext } from "@nestjs/common";
import { Client } from "discord.js";
import { NecordExecutionContext } from "necord";

export class Utils {
	static context(executionContext: ExecutionContext) {
		const NecordContext = NecordExecutionContext.create(executionContext);
		const [[client, context], command] =
			NecordContext.getArgs<[[Client, Context], LegacyCommandsDiscovery | SlashCommandsDiscovery]>();
		const legacyCommandOptions = (command as LegacyCommandsDiscovery).toJSON();
		const slashCommandOptions = (command as SlashCommandsDiscovery).toJSON();

		return {
			client,
			context,
			legacyCommandOptions,
			slashCommandOptions,
		};
	}

	static SendFunction(context: Context, content: Content) {
		if (context.isDM) {
			return context.sendToUserDM(content);
		}
		return context.reply(content);
	}

	public static formatArray(array: Array<string>) {
		return new Intl.ListFormat("pt-BR", {
			style: "short",
			type: "conjunction",
		}).format(array);
	}
}
