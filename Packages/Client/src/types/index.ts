import { Context } from "@/modules/commands/Commands.context";
import { LegacyCommandsDiscovery, SlashCommandsDiscovery } from "@/modules/commands/Commands.discovery";
import { LocalizationMap } from "discord-api-types/v10";
import {
	BaseMessageOptions,
	Channel,
	Collection,
	CommandInteraction,
	EmbedBuilder,
	Emoji,
	GuildChannel,
	Message,
	PartialMessage,
	PermissionResolvable,
	Role,
	SlashCommandBuilder,
	TextChannel,
} from "discord.js";
export interface AlsStore {
	PrismaConnected: boolean;
	LegacyCommands: Collection<string, LegacyCommandsDiscovery>;
	Aliases: Collection<string, string>;
	SlashCommands: Collection<string, SlashCommandsDiscovery>;
	SubCommands: Collection<string, SlashCommandsDiscovery>;
}

export type Content = string | EmbedBuilder | BaseMessageOptions;

export type ENVIRONMENT = "DEVELOPMENT" | "PRODUCTION";
export interface Config {
	ENVIRONMENT: ENVIRONMENT;
	Database: {
		Version: string;
		URL: string;
		Name: string;
		Password: string;
		Redis: {
			Port: string;
			Host: string;
		};
	};
	Discord: {
		Token: string;
		DevToken: string;
		Client: {
			Owners: Array<string>;
			Secret: string;
			ID: string;
		};
		Servers: {
			NDCommunity: string;
			TestGuild: string;
		};
	};
	Debug: {
		Client: boolean;
		Translations: boolean;
		Lavalink: boolean;
		PremiumMusicPlayer: boolean;
	};
	Music: {
		Lavalink: boolean;
		Volumes: {
			Lavalink: number;
			Player: number;
		};
		Player: {
			AutoLeaveEmpty: {
				Channel: {
					Enable: boolean;
					Delay: number;
				};
				Queue: {
					Enable: boolean;
					Delay: number;
				};
			};
		};
		Client: {
			selfDeaf: boolean;
			serverDeaf: boolean;
		};
	};
	Emojis: {
		logo: string;
		fail: string;
		accept: string;
		success: string;
		thing: string;
		loading: string;
		loading2: string;
		delayping: string;
		Music: {
			Youtube: string;
			Spotify: string;
			SoundCloud: string;
			Deezer: string;
			Facebook: string;
			Apple: string;
			Twitch: string;
		};
	};
	URLList: {
		Music: {
			Youtube: string;
			ShortYoutube: string;
			SoundCloud: string;
			Spotify: string;
			Deezer: string;
			Facebook: string;
			Apple: string;
			Twitch: string;
		};
	};
	EvalBadKeys: Array<string>;
}

export interface LegacyCommandOptions {
	name: string;
	aliases?: Array<string>;
	description: string;
	usage: string;
	args?: {
		min: number;
		max: number;
	};
}

export interface SlashCommandOptions {
	data?: Partial<SlashCommandBuilder>;
	deployMode?: "Test" | "Guild" | "Global";
	type: "Main" | "Sub" | "Group";
	name?: string;
}

export interface CommandConfigOptions {
	category: string;
	disable?: boolean;
	cooldown?: number;
}

export interface CommandPermissionsOptions {
	user: Array<PermissionResolvable>;
	bot: Array<PermissionResolvable>;
	guildOnly?: boolean;
	ownerOnly?: boolean;
}

export interface Localization {
	name: LocalizationMap;
	description: LocalizationMap;
	options?: {
		[key: string]: Localization;
	};
}

export enum DatabaseStatus {
	Created = 0,
	Error = 1,
}

export type TranslateInfo = Message | CommandInteraction | GuildChannel | PartialMessage | Context;

export interface ReactionsType {
	message: Message["id"];
	channel: Channel["id"];
	role: Role["id"];
	emoji: Emoji["name"] | Emoji["identifier"];
	option: REACTION_OPTIONS;
}

export enum REACTION_OPTIONS {
	_1 = 1,
	_2 = 2,
	_3 = 3,
	_4 = 4,
	_5 = 5,
	_6 = 6,
}

export enum FetchType {
	All = "All",
	Channel = "Channel",
}

export interface iReactionArray {
	message: string;
	channel: string;
	role: string;
	emoji: string;
	option: number;
}

export interface iReaction {
	Channel: TextChannel["id"];
	Message: Message["id"];
	Role: Role["id"];
	Emoji: Emoji["id"] | Emoji["identifier"];
	Option?: REACTION_OPTIONS;
}
