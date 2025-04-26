import type { DatabaseStatus } from "@/types";
import type { Guild } from "discord.js";
import type { GuildEntity } from "../../modules/database/entities";

export interface IGuildRepository {
	guildSettings();
	get(guildId: string): Promise<GuildEntity>;
	getAll(): Promise<GuildEntity[]>;
	create(
		guild: Guild,
	): Promise<{ callback: GuildEntity | undefined; status: DatabaseStatus }>;
	update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity>;
	delete(guild: Guild): Promise<GuildEntity>;
}
