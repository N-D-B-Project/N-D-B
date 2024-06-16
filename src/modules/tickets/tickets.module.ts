import { Module } from "@nestjs/common";
import * as Commands from "./commands"
import { TicketsRepository } from "./repositories/tickets.repository";
import { Tickets } from "./types/constants";
import { TicketsService } from "./tickets.service";

@Module({
  providers: [...Object.values(Commands),
    {
      provide: Tickets.Service,
      useClass: TicketsService
    },
    {
      provide: Tickets.Repository,
      useClass: TicketsRepository
    }
  ]
})
export class TicketsModule {}
