import { CommandPermissions } from "@/common/decorators";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Client } from "discord.js";
import { CommandsService as _CommandsService, SlashCommand, SlashCommandDiscovery, SlashCommandsService, Subcommand } from "necord";
import { ExplorerService } from "necord/dist/necord-explorer.service";
import { Config } from "../config/types";
import { CommandPermissionsOptions } from "@/common/decorators/CommandPermissions.decorator";

@Injectable()
export class CommandsService implements OnApplicationBootstrap {
	private readonly logger = new Logger(CommandsService.name);

	constructor(
		private readonly slashCommandService: SlashCommandsService,
		private readonly explorerService: ExplorerService<SlashCommandDiscovery>,
		private readonly commandService: _CommandsService,
		private readonly reflector: Reflector,
		private readonly configService: ConfigService,
		private readonly client: Client,
	) {}

	async onApplicationBootstrap() {
		this.client.once("ready", async (client) => this.commandService.registerAllCommands());
		await this.updateMeta();
	}

	async updateMeta() {
		this.logger.verbose("Updating metadata for SlashCommands | SubCommands");

    this.updateSlashCommands();
    this.updateSubCommands();

		if (!this.client.isReady()) return;
		await this.commandService.registerAllCommands();
	}

  private updateSlashCommands(): void {
    const slashCommands = this.explorerService.explore(SlashCommand.KEY);
    this.logger.verbose(`${slashCommands.length} SlashCommand (s) explored`);
    for (const command of slashCommands) {
			const perms: CommandPermissionsOptions = this.reflector.get(CommandPermissions.KEY, command.getHandler());
			this.slashCommandService.add(command);
			const guilds = [];
			if (perms.guildOnly) {
				guilds.push(this.configService.getOrThrow<Config["Discord"]>("Discord").Servers.NDCommunity);
			}
			if (perms.testOnly) {
				guilds.push(this.configService.getOrThrow<Config["Discord"]>("Discord").Servers.TestGuild);
			}
      if(perms.guilds) {
        guilds.push(perms.guilds.values())
      }

			if (!guilds) return;

			this.logger.verbose(`Updating metadata for SlashCommand : ${command.getName()}`);

			command["meta"]["guilds"] = guilds ?? [];
			this.slashCommandService.add(command);
		}
  }

  private updateSubCommands(): void {
    const subCommands = this.explorerService.explore(Subcommand.KEY);
    this.logger.verbose(`${subCommands.length} SubCommand (s) explored`);
    for (const command of subCommands) {
			const perms: CommandPermissionsOptions = this.reflector.get(CommandPermissions.KEY, command.getHandler());
			this.slashCommandService.add(command);
			const guilds = [];
			if (perms.guildOnly) {
				guilds.push(this.configService.getOrThrow<Config["Discord"]>("Discord").Servers.NDCommunity);
			}
			if (perms.testOnly) {
				guilds.push(this.configService.getOrThrow<Config["Discord"]>("Discord").Servers.TestGuild);
			}
      if(perms.guilds) {
        guilds.push(perms.guilds.values())
      }

			if (!guilds) return;

			this.logger.verbose(`Updating metadata for SubCommand : ${command.getName()}`);

			command["meta"]["guilds"] = guilds ?? [];
			this.slashCommandService.addSubCommand(command);
		}
  }
}
