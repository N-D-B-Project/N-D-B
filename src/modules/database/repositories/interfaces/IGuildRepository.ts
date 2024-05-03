import type { Guild } from "discord.js"
import type { GuildEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";

export interface IGuildRepository {
	get(guildId: string): Promise<GuildEntity>;
	create(guild: Guild): Promise<{ callback: GuildEntity | void; status: DatabaseStatus }>;
	update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity>;
	delete(guild: Guild): Promise<GuildEntity>;
}
