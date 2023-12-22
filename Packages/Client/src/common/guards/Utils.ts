import { Content } from "@/types";
import { ExecutionContext } from "@nestjs/common";
import { Client } from "discord.js";
import { NecordExecutionContext } from "necord";
import { Context } from "../../modules/commands/Commands.context";
import { CommandsDiscovery } from "../../modules/commands/Commands.discovery";

export class Utils {
	static context(executionContext: ExecutionContext) {
		const NecordContext = NecordExecutionContext.create(executionContext);
		const [[client, context], command] = NecordContext.getArgs<[[Client, Context], CommandsDiscovery]>();
		const commandOptions = command.toJSON();

		return {
			client,
			context,
			commandOptions,
		};
	}

	static SendFunction(context: Context, content: Content) {
		if (context.isDM) {
			return context.sendToUserDM(content);
		}
		return context.reply(content);
	}
}
