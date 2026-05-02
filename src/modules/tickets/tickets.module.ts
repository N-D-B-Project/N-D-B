import {
	GuildSettings,
	Tickets as TicketsEntity,
	TicketType,
} from "@ndb/database";
import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmojiFilter } from "@/common/filters/emoji.filter";
import * as Commands from "./commands";
import * as Components from "./components";
import { TicketsRepository } from "./repositories/tickets.repository";
import { TranscriptService } from "./services/transcript.service";
import { TicketEmbeds } from "./Tickets.embeds";
import { TicketsService } from "./tickets.service";
import { Tickets } from "./types/constants";

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
