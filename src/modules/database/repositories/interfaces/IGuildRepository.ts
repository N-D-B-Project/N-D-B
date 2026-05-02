import type { Guild, GuildSettings } from "@ndb/database";
import type { Guild as DiscordGuild } from "discord.js";
import type { DatabaseStatus } from "../../types";

export interface IGuildRepository {
	updateSettings(guildId: string, data: Partial<GuildSettings>): Promise<void>;
	get(guildId: string): Promise<Guild>;
	getAll(): Promise<Guild[]>;
	create(
		guild: DiscordGuild,
	): Promise<{ callback: Guild | undefined; status: DatabaseStatus }>;
	update(oldGuild: DiscordGuild, newGuild: DiscordGuild): Promise<Guild>;
	delete(guild: DiscordGuild): Promise<Guild>;
}
