import type { Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type { Guild } from "discord.js";
import type { GuildEntity } from "../../entities";
import type { DatabaseStatus } from "../../types";

export interface IGuildRepository {
	guildSettings(): Prisma.GuildSettingsDelegate<DefaultArgs>;
	get(guildId: string): Promise<GuildEntity>;
	getAll(): Promise<GuildEntity[]>;
	create(
		guild: Guild,
	): Promise<{ callback: GuildEntity | void; status: DatabaseStatus }>;
	update(oldGuild: Guild, newGuild: Guild): Promise<GuildEntity>;
	delete(guild: Guild): Promise<GuildEntity>;
}
