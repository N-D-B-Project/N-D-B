import {
	CommandPermissionsKey,
	type CommandPermissionsOptions,
} from "@/common/decorators";
import {
	CommandConfigKey,
	type CommandConfigOptions,
} from "@/common/decorators";
import {
	Injectable,
	Logger,
	type OnApplicationBootstrap,
} from "@nestjs/common";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { ConfigService } from "@nestjs/config";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Reflector } from "@nestjs/core";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { Client } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import {
	ExplorerService,
	SlashCommand,
	type SlashCommandDiscovery,
	SlashCommandsService,
	Subcommand,
	CommandsService as _CommandsService,
} from "necord";

@Injectable()
export class CommandsService implements OnApplicationBootstrap {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly slashCommandService: SlashCommandsService,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly commandsService: _CommandsService,
		private readonly reflector: Reflector,
		private readonly configService: ConfigService,
		private readonly client: Client,
	) {}

	public async onApplicationBootstrap() {
		// this.logger.verbose("Updating metadata for SlashCommands | SubCommands");
		this.client.once(
			"ready",
			async (client) => await this.commandsService.registerAllCommands(),
		);
		await this.updateSlashCommands();
		await this.updateSubCommands();
		if (!this.client.isReady()) return;
		await this.commandsService.registerAllCommands();
	}

	private getCommandData(command: SlashCommandDiscovery) {
		const config: CommandConfigOptions = this.reflector.get(
			CommandConfigKey,
			command.getHandler(),
		);
		const perms: CommandPermissionsOptions = this.reflector.get(
			CommandPermissionsKey,
			command.getHandler(),
		);

		return { config, perms };
	}

	private managePerms(perms: CommandPermissionsOptions): string[] {
		const guilds = [];
		if (perms.guildOnly) {
			guilds.push(
				this.configService.getOrThrow<string>("Discord.Servers.NDCommunity"),
			);
		}
		if (perms.testOnly) {
			guilds.push(
				this.configService.getOrThrow<string>("Discord.Servers.TestGuild"),
			);
		}
		if (perms.guilds) {
			guilds.push(perms.guilds.values());
		}

		if (!guilds) return;

		return guilds;
	}

	private log(
		type: "SlashCommand" | "SubCommand",
		category: string,
		name: string,
		deployMode: string,
	): void {
		const formattedCategory = `[${category}]`.padEnd(23);
		this.logger.verbose(
			`Updating metadata for ${type} : ${formattedCategory} ${name.padEnd(15)} | Deploy mode: ${deployMode}`,
		);
	}

	private async updateSlashCommands(): Promise<void> {
		const slashCommands = this.explorerService.explore(SlashCommand.KEY);
		this.logger.verbose(`${slashCommands.length} SlashCommand (s) explored`);
		for (const command of slashCommands) {
			this.slashCommandService.remove(command.getName());
			const { config, perms } = this.getCommandData(command);
			const guilds = this.managePerms(perms);
			const deployMode = guilds.length > 0 ? "Guild" : "Global";
			this.log("SlashCommand", config.category, command.getName(), deployMode);
			command.setGuilds(guilds ?? []);
			this.slashCommandService.add(command);
		}
	}

	private async updateSubCommands(): Promise<void> {
		const subCommands = this.explorerService.explore(Subcommand.KEY);
		this.logger.verbose(`${subCommands.length} SubCommand (s) explored`);
		for (const command of subCommands) {
			this.slashCommandService.remove(command.getName());
			const { config, perms } = this.getCommandData(command);
			const guilds = this.managePerms(perms);
			const deployMode = guilds.length > 0 ? "Guild" : "Global";
			this.log("SubCommand", config.category, command.getName(), deployMode);
			command.setGuilds(guilds ?? []);
			this.slashCommandService.addSubCommand(command);
		}
	}
}
