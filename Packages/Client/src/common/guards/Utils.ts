import { Content } from "@/modules/commands/types";
import { ExecutionContext } from "@nestjs/common";
import { Client } from "discord.js";
import { NecordExecutionContext } from "necord";
import { Context } from "../../modules/commands/Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "../../modules/commands/Commands.discovery";

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
