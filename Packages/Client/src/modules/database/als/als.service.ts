import { AlsStore } from "@/types";
import { Repositories } from "@/types/Constants";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Collection } from "discord.js";

@Injectable()
export class AlsService implements OnModuleInit {
	public constructor(@Inject(Repositories.ALS) private readonly als: AsyncLocalStorage<AlsStore>) {}

	public async onModuleInit() {
		this.als.enterWith({
			PrismaConnected: false,
			LegacyCommands: new Collection(),
			Aliases: new Collection(),
			SlashCommands: new Collection(),
			SubCommands: new Collection(),
		});
	}
}
