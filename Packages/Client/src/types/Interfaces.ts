import { Context } from "@/modules/commands/Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "@/modules/commands/Commands.discovery";
import { GuildEntity, ReactionRolesEntity, UserEntity } from "@/modules/database/entities";
import { IReactionRolesRepository } from "@/modules/reactionRoles/interfaces/IReactionRoleRepository";
import { ConfigService } from "@nestjs/config";
import { AsyncLocalStorage } from "async_hooks";
import { Client, EmbedBuilder, Guild, Message, Role, TextChannel, User } from "discord.js";
import { AlsStore, Config, Content, DatabaseStatus, REACTION_OPTIONS, TranslateInfo, iReaction } from ".";

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

export interface IReactionRolesService {
	Embeds(): Promise<IReactionRolesEmbeds>;
	getAll(guild: Guild): Promise<Array<ReactionRolesEntity>>;
	getInChannel(guild: Guild, channel: TextChannel): Promise<Array<ReactionRolesEntity>>;
	getOne(guild: Guild, { Channel, Message, Role, Emoji, Option }: iReaction): Promise<ReactionRolesEntity>;
	Create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }>;
	Delete(guild: Guild, { Channel, Message, Role, Emoji }: iReaction): Promise<{ status: "UnableToDelete" | "Deleted" }>;
	DeleteAll(guild: Guild): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }>;
	Update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}>;

	CheckParams(
		client: Client,
		context: Context,
		channel: TextChannel,
		messageId: string,
		message: Message,
		role: Role,
		emoji: string,
	): Promise<boolean | EmbedBuilder | Message>;
}

export interface IReactionRolesEmbeds {
	InvalidChannelEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidIDEmbed(context: Context): Promise<EmbedBuilder>;
	MessageNotFoundEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidRoleEmbed(context: Context): Promise<EmbedBuilder>;
	InvalidEmojiEmbed(context: Context): Promise<EmbedBuilder>;
	ReactionRoleCreatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
	): Promise<EmbedBuilder>;
	ReactionRoleRemovedEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
	ReactionRoleUpdatedEmbed(
		context: Context,
		{ Channel, Message, Role, Emoji }: iReaction,
		newOption: REACTION_OPTIONS,
	): Promise<EmbedBuilder>;
	ReactionRoleDeleteAllEmbed(
		context: Context,
		status: "Confirm" | "Cancel" | "Success",
		ReactionCount: number | null,
	): Promise<EmbedBuilder>;
	UnableToCreateReactionRoleEmbed(context: Context): Promise<EmbedBuilder>;
	UnableToDeleteReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
	UnableToDeleteAllReactionRoleEmbed(context: Context): Promise<EmbedBuilder>;
	UnableToUpdateReactionRoleEmbed(context: Context, MsgID: Message): Promise<EmbedBuilder>;
}
