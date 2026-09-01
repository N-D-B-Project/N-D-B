import {
	GuildSettings,
	Tickets as TicketsEntity,
	TicketType,
} from "@ndb/database";
import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmojiFilter } from "#src/common/filters/emoji.filter.js";
import * as Commands from "./commands/index.js";
import * as Components from "./components/index.js";
import { TicketsRepository } from "./repositories/tickets.repository.js";
import { TranscriptService } from "./services/transcript.service.js";
import { TicketEmbeds } from "./Tickets.embeds.js";
import { TicketsService } from "./tickets.service.js";
import { Tickets } from "./types/constants.js";

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([TicketsEntity, TicketType, GuildSettings]),
	],
	providers: [
		...Object.values(Commands),
		...Object.values(Components),
		TranscriptService,
		{
			provide: Tickets.Service,
			useClass: TicketsService,
		},
		{
			provide: Tickets.Repository,
			useClass: TicketsRepository,
		},
		{
			provide: Tickets.Embeds,
			useClass: TicketEmbeds,
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
