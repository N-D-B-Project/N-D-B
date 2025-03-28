import {
	CommandPermissionsKey,
	type CommandPermissionsOptions,
} from "@/common/decorators";
import {
	CommandConfigKey,
	type CommandConfigOptions,
} from "@/common/decorators";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@/modules/config";
import { Services } from "@/types";
import {
	Inject,
	Injectable,
	Logger,
	type OnApplicationBootstrap,
} from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Reflector } from "@nestjs/core";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	ExplorerService,
	CommandsService as NecordCommandsService,
	SlashCommand,
	type SlashCommandDiscovery,
	SlashCommandsService,
	Subcommand,
} from "necord";

@Injectable()
export class CommandsService implements OnApplicationBootstrap {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly slashCommandService: SlashCommandsService,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly commandsService: NecordCommandsService,
		private readonly reflector: Reflector,
		@Inject(Services.Config)
		private readonly configService: ConfigService,
		private readonly client: Client,
	) {}

	public async onApplicationBootstrap(): Promise<void> {
		this.logger.verbose("Initializing command metadata update");

		this.client.once("ready", async () => {
			await this.commandsService.registerAllCommands();
		});

		await this.updateCommands("SlashCommand", SlashCommand.KEY);
		await this.updateCommands("SubCommand", Subcommand.KEY);
		if (this.client.isReady()) {
			await this.commandsService.registerAllCommands();
		}
	}

	private getCommandData(command: SlashCommandDiscovery) {
		const config = this.reflector.get<CommandConfigOptions>(
			CommandConfigKey,
			command.getHandler(),
		);
		const perms = this.reflector.get<CommandPermissionsOptions>(
			CommandPermissionsKey,
			command.getHandler(),
		);

		return { config, perms };
	}

	private getGuilds(perms: CommandPermissionsOptions): string[] {
		const guilds: string[] = [];

		if (perms.guildOnly) {
			guilds.push(this.configService.get("Discord").Servers.NDCommunity);
		}
		if (perms.testOnly) {
			guilds.push(this.configService.get("Discord").Servers.TestGuild);
		}
		if (perms.guilds) {
			guilds.push(...perms.guilds);
		}

		return guilds;
	}

	private logCommandUpdate(
		type: "SlashCommand" | "SubCommand",
		category: string,
		name: string,
		deployMode: string,
	): void {
		const formattedCategory = `[${category}]`.padEnd(23);
		this.logger.verbose(
			`Updating ${type} metadata: ${formattedCategory} ${name.padEnd(15)} | Deploy mode: ${deployMode}`,
		);
	}

	private async updateCommands(
		type: "SlashCommand" | "SubCommand",
		key: string,
	): Promise<void> {
		const commands = this.explorerService.explore(key);
		this.logger.verbose(`${commands.length} ${type}(s) explored`);

		for (const command of commands) {
			this.slashCommandService.remove(command.getName());

			const { config, perms } = this.getCommandData(command);
			if (config.disable) return;
			if (!config || !perms) {
				this.logger.error(`Missing metadata for ${type} ${command.getName()}`);
				continue;
			}

			const guilds = this.getGuilds(perms);
			const deployMode = guilds.length > 0 ? "Guild" : "Global";

			this.logCommandUpdate(
				type,
				config.category,
				command.getName(),
				deployMode,
			);

			command.setGuilds(guilds);

			if (type === "SlashCommand") {
				this.slashCommandService.add(command);
			} else {
				this.slashCommandService.addSubCommand(command);
			}
		}
	}
}
