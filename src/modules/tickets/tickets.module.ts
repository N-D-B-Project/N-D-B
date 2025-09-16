import { Global, Module } from "@nestjs/common";
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
	],
	exports: [
		{
			provide: Tickets.Repository,
			useClass: TicketsRepository,
		},
	],
})
export class TicketsModule {}
