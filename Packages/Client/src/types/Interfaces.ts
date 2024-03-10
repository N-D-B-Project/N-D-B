import { Context } from "@/modules/commands/Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "@/modules/commands/Commands.discovery";
import { GuildEntity, UserEntity } from "@/modules/database/entities";
import { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces/IReactionRoleRepository";
import { ConfigService } from "@nestjs/config";
import { AsyncLocalStorage } from "async_hooks";
import { EmbedBuilder, Guild, User } from "discord.js";
import { AlsStore, Config, Content, DatabaseStatus, TranslateInfo } from ".";

export interface INDBService {
	buildPaginator(context: Context, embeds: Array<EmbedBuilder>, id: string): Promise<Content>;
}

export interface IDatabaseService {
	AlsRepo(): IAsyncLocalStorage;
	ConfigRepo(): ConfigService<Config>;
	GuildRepo(): IGuildRepository;
	UserRepo(): IUserRepository;
	ReactionRolesRepo(): IReactionRolesRepository;
}

export interface IGuildRepository {
	get(guildId: string): Promise<GuildEntity>;
	create(guild: Guild): Promise<{ callback: GuildEntity | void; status: DatabaseStatus }>;
	update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity>;
	delete(guild: Guild): Promise<GuildEntity>;
}

export interface IUserRepository {
	get(userId: string): Promise<UserEntity>;
	create(user: User): Promise<{ callback: UserEntity | void; status: DatabaseStatus }>;
	update(oldUser: User, newUser: User): Promise<UserEntity>;
	delete(user: User): Promise<UserEntity>;
}

export type IAsyncLocalStorage = AsyncLocalStorage<AlsStore>;

export interface Ii18nService {
	Logger(): void;
	Guild(info: TranslateInfo, key: string, args?: Record<string, unknown>): Promise<string>;
	DM(key: string, user: User, args?: Record<string, unknown>): Promise<string>;
	TFunction(context: Context, key: string, args?: Record<string, unknown>): Promise<string>;
}

export interface ICommandsService {
	loadLegacy(command: LegacyCommandsDiscovery): Promise<void>;
	loadSlash(command: SlashCommandsDiscovery): Promise<void>;
	get(cmdName: string, context: Context): Promise<LegacyCommandsDiscovery | SlashCommandsDiscovery>;
}
