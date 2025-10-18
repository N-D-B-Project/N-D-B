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
	CommandsService as NecordCommandsService,
	NecordExplorerService,
	SlashCommand,
	type SlashCommandDiscovery,
	SlashCommandsService,
	Subcommand,
} from "necord";
import {
	CommandConfigKey,
	type CommandConfigOptions,
	CommandPermissionsKey,
	type CommandPermissionsOptions,
} from "@/common/decorators";

@Injectable()
export class CommandsService implements OnApplicationBootstrap {
	private readonly logger = new Logger(CommandsService.name);

	public constructor(
		private readonly slashCommandService: SlashCommandsService,
		private readonly explorerService: NecordExplorerService<SlashCommandDiscovery>,
		private readonly commandsService: NecordCommandsService,
		private readonly reflector: Reflector,
		private readonly configService: ConfigService,
		private readonly client: Client,
	) {}

	public async onApplicationBootstrap(): Promise<void> {
		this.logger.verbose("Initializing command metadata update");

		this.client.once("clientReady", async () => {
			await this.commandsService.registerAllCommands();
		});

		await this.updateCommands("SlashCommand", SlashCommand.KEY);
		await this.updateCommands("SubCommand", Subcommand.KEY);
		if (this.client.isReady()) {
			await this.commandsService.registerAllCommands();
		}
	}

	public async getCommandMention(name: string): Promise<string> {
		if (!this.client.application?.commands.cache.size) {
			await this.client.application?.commands.fetch();
		}

		const command = this.client.application?.commands.cache.find(
			(cmd) => cmd.name === name.split(" ")[0],
		);

		const parts = name.split(" ");
		parts.shift();
		const suffix = parts.length ? ` ${parts.join(" ")}` : "";

		return `</${command.name}${suffix}:${command.id}>`;
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
			if (!this.validateCommand(command)) continue;
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

	private validateCommand(command: SlashCommandDiscovery): boolean {
		const COMMAND_NAME_REGEX = /^[a-z0-9_-]{1,32}$/;
		const name = command.getName();

		if (!COMMAND_NAME_REGEX.test(name)) {
			this.logger.error(`❌ Invalid command name "${name}"`);
			return false;
		}

		if (command.toJSON().nameLocalizations) {
			for (const [locale, localizedName] of Object.entries(
				command.toJSON().nameLocalizations,
			)) {
				if (!COMMAND_NAME_REGEX.test(localizedName as string)) {
					this.logger.error(
						`❌ Invalid localized name "${localizedName}" for locale "${locale}" in command "${name}"`,
					);
					return false;
				}
			}
		}

		if (command.getOptions()) {
			for (const option of command.getOptions()) {
				if (!COMMAND_NAME_REGEX.test(option.name)) {
					this.logger.error(
						`❌ Invalid option name "${option.name}" in command "${name}"`,
					);
					return false;
				}

				if (option.name_localizations) {
					for (const [locale, localizedName] of Object.entries(
						option.name_localizations,
					)) {
						if (!COMMAND_NAME_REGEX.test(localizedName as string)) {
							this.logger.error(
								`❌ Invalid localized option name "${localizedName}" for locale "${locale}" in option "${option.name}" (command "${name}")`,
							);
							return false;
						}
					}
				}

				if (option.options) {
					for (const subOption of option.options) {
						if (!COMMAND_NAME_REGEX.test(subOption.name)) {
							this.logger.error(
								`❌ Invalid sub-option name "${subOption.name}" in command "${name}"`,
							);
							return false;
						}

						if (subOption.name_localizations) {
							for (const [locale, localizedName] of Object.entries(
								subOption.name_localizations,
							)) {
								if (!COMMAND_NAME_REGEX.test(localizedName as string)) {
									this.logger.error(
										`❌ Invalid localized sub-option name "${localizedName}" for locale "${locale}" in sub-option "${subOption.name}" (command "${name}")`,
									);
									return false;
								}
							}
						}
					}
				}
			}
		}

		return true;
	}
}
