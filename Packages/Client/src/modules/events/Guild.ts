import { Services } from "@/types/Constants";
import { IDatabaseService } from "@/types/Interfaces";
import { Inject, Injectable } from "@nestjs/common";
import { Context, ContextOf, On } from "necord";

@Injectable()
export class GuildEvents {
	public constructor(@Inject(Services.Database) private readonly database: IDatabaseService) {}

	@On("guildCreate")
	public async onGuildCreate(@Context() [guild]: ContextOf<"guildCreate">) {
		await this.database.GuildRepo().create(guild);
	}

	@On("guildDelete")
	public async onGuildDelete(@Context() [guild]: ContextOf<"guildDelete">) {
		await this.database.GuildRepo().delete(guild);
	}

	@On("guildUpdate")
	public async onGuildUpdate(@Context() [oldGuild, newGuild]: ContextOf<"guildUpdate">) {
		await this.database.GuildRepo().update(oldGuild, newGuild);
	}
}
