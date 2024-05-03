import { Module } from "@nestjs/common";
import * as Commands from "./index";
import { CommandsService } from "./Commands.service";

@Module({
	providers: [...Object.values(Commands), CommandsService],
})
export class CommandsModule {}
