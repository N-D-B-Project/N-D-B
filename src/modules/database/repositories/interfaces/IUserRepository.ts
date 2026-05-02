import type { User, UserSettings } from "@ndb/database";
import type { User as DiscordUser } from "discord.js";
import type { DatabaseStatus } from "../../types";

export interface IUserRepository {
	updateSettings(userId: string, data: Partial<UserSettings>): Promise<void>;
	get(userId: string): Promise<User>;
	getAll(): Promise<User[]>;
	create(
		user: DiscordUser,
	): Promise<{ callback: User | undefined; status: DatabaseStatus }>;
	update(user: DiscordUser): Promise<User>;
	delete(user: DiscordUser): Promise<User>;
}
