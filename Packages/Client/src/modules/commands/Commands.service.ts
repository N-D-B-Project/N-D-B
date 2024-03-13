import { CommandConfig } from "@/common/decorators";
import { CommandError } from "@/common/errors/Command.error";
import { Config } from "@/modules/config/types";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Client } from "discord.js";
import type { IDatabaseService } from "../database/interfaces/IDatabaseService";
import { Context } from "./Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "./Commands.discovery";
import type { ICommandsService } from "./interfaces/ICommandService";

@Injectable()
export class CommandsService implements ICommandsService {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		private readonly client: Client,
		private readonly config: ConfigService,
		private readonly reflector: Reflector,
	) {}

	public async loadLegacy(command: LegacyCommandsDiscovery): Promise<void> {
		const als = this.database.AlsRepo();
		const Legacy = command.toJSON().name;
		const Aliases = command.toJSON().aliases;

		if (Legacy && !als.getStore()["LegacyCommands"].get(Legacy)) {
			als.getStore()["LegacyCommands"].set(Legacy, command);
			if (Aliases) {
				for (const alias of Aliases) {
					als.getStore()["Aliases"].set(alias, Legacy);
				}
			}
		}
	}

	public async loadSlash(command: SlashCommandsDiscovery): Promise<void> {
		const als = this.database.AlsRepo();
		const Slash = command.toJSON();
		const Sub = command.toJSON().name;
		const SubFullName = Sub + this.reflector.get(CommandConfig.KEY, command.getHandler()).category;

		if (this.client.application?.partial) {
			await this.client.application.fetch();
		}

		if (Slash?.type === "Main" && !als.getStore()["SlashCommands"].get(Slash?.data.name)) {
			try {
				const data = Slash?.data.toJSON();
				als.getStore()["SlashCommands"].set(Slash?.data.name, command);
				const applicationCommands = this.client.application?.commands;
				const guildCommands = this.client.guilds.cache.get(
					this.config.getOrThrow<Config["Discord"]>("Discord").Servers.NDCommunity,
				)?.commands;
				const testGuildCommands = this.client.guilds.cache.get(
					this.config.getOrThrow<Config["Discord"]>("Discord").Servers.TestGuild,
				)?.commands;
				if (Slash?.deployMode === "Global") {
					await applicationCommands.create(data);
				}

				if (Slash?.deployMode === "Guild") {
					await guildCommands?.create(data);
				}

				if (Slash?.deployMode === "Test") {
					await testGuildCommands?.create(data);
				}
			} catch (error) {
				throw new CommandError(`Error when Registering Application Commands: ${error as Error}`);
			}
		}

		if (Slash?.type === "Sub" && !als.getStore()["SubCommands"].get(SubFullName)) {
			if (!Slash.name) throw new CommandError(`SubCommand don't have a name: ${command.getClass()}`);
			als.getStore()["SubCommands"].set(SubFullName, command);
		}
	}

	public async get(cmdName: string, context: Context): Promise<LegacyCommandsDiscovery | SlashCommandsDiscovery> {
		if (context.isSlash) {
			if (context.isSub) {
				return this.database.AlsRepo().getStore()["SubCommands"].get(cmdName);
			}

			return this.database.AlsRepo().getStore()["SlashCommands"].get(cmdName);
		}

		return this.resolveCommand(cmdName);
	}

	private resolveCommand(nameOrAlias: string) {
		return (
			this.database.AlsRepo().getStore()["LegacyCommands"].get(nameOrAlias) ??
			this.database
				.AlsRepo()
				.getStore()
				["LegacyCommands"].get(this.database.AlsRepo().getStore()["Aliases"].get(nameOrAlias)!)
		);
	}
}
