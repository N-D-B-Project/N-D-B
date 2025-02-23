import type { Guild } from "discord.js";
import type { GuildEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";

export interface IGuildRepository {
	guildSettings();
	get(guildId: string): Promise<GuildEntity>;
	getAll(): Promise<GuildEntity[]>;
	create(
		guild: Guild,
		// biome-ignore lint/suspicious/noConfusingVoidType: <Prisma returns void if no data is returned>
	): Promise<{ callback: GuildEntity | void; status: DatabaseStatus }>;
	update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity>;
	delete(guild: Guild): Promise<GuildEntity>;
}
