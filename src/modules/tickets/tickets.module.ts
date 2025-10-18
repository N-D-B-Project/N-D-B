import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { EmojiFilter } from "@/common/filters/emoji.filter";
import * as Commands from "./commands";
import { TicketsRepository } from "./repositories/tickets.repository";
import { TicketsService } from "./tickets.service";
import { Tickets } from "./types/constants";

@Global()
@Module({
	providers: [
		...Object.values(Commands),
		{
			provide: Tickets.Service,
			useClass: TicketsService,
		},
		{
			provide: Tickets.Repository,
			useClass: TicketsRepository,
		},
		{
			provide: APP_FILTER,
			useClass: EmojiFilter,
		},
	],
	exports: [
		{
			provide: Tickets.Repository,
			useClass: TicketsRepository,
		},
	],
})
export class TicketsModule {}
