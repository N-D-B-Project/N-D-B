import { Extends, Services } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Client, CommandInteraction, CommandInteractionOptionResolver, Message } from "discord.js";
import type { IDatabaseService } from "../../database/interfaces/IDatabaseService";
import { Context } from "../commands/Commands.context";
import { RunSubCommandEvent } from "../commands/Commands.discovery";
import type { ICommandsService } from "../commands/interfaces/ICommandService";

@Injectable()
export class CommandsEvents {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(Extends.Command) private readonly commandsService: ICommandsService,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(CommandsEvents.name);

	@OnEvent("commands.legacy", { async: true })
	public async onGuildCommand(message: Message, prefix: string) {
		await this.Runner(message, prefix, "None");
	}

	@OnEvent("commands.dm")
	public async onDMCommand(message: Message, prefix: string) {
		await this.Runner(message, prefix, "DM");
	}

	@OnEvent("commands.slash")
	public async onInteractionCommand(interaction: CommandInteraction) {
		const { Premium } = (await this.database.GuildRepo().get(interaction.guildId)).Settings;
		const context = new Context(interaction, interaction.options as CommandInteractionOptionResolver, "None", Premium);
		const _Command = await this.commandsService.get(interaction.commandName, context);
		if (_Command) {
			await interaction.deferReply().catch((e) => {});
			_Command.execute([this.client, context]);
		}
	}

	@OnEvent("commands.sub")
	public async onSubCommand({ context, SubList, Additional }: RunSubCommandEvent) {
		const { Premium } = (await this.database.GuildRepo().get(context.guild.id)).Settings;
		const args = await context.getInteractionArgs();
		for (const { name } of SubList) {
			if (args.getSubcommand() === name) {
				const newContext = new Context(context.interaction, args.data[0].options, Additional, Premium);
				const _SubCommand = await this.commandsService.get(name, newContext);
				if (_SubCommand) {
					_SubCommand.execute([this.client, newContext]);
				}
			}
		}
	}

	@OnEvent("commands.registered")
	public async onCommandsRegistered() {
		this.logger.log(`${this.database.AlsRepo().getStore()["LegacyCommands"].size} Legacy Commands`);
		this.logger.log(`${this.database.AlsRepo().getStore()["SlashCommands"].size} Slash Commands`);
		this.logger.log(`${this.database.AlsRepo().getStore()["SubCommands"].size} Sub Commands`);
	}

	private async Runner(message: Message, prefix: string, type: "None" | "DM") {
		const { Premium } = (await this.database.GuildRepo().get(message.guildId)).Settings;
		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const context = new Context(message, args, type, Premium, prefix);
		const _Command = await this.commandsService.get(cmd, context);
		if (_Command) {
			return _Command.execute([this.client, context]);
		}
	}
}
