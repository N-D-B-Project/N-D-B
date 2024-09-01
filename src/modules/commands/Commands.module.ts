import { Module } from "@nestjs/common";
import { CommandsService } from "./Commands.service";
import * as Commands from "./index";

@Module({
	imports: [...Object.values(Commands)],
	providers: [CommandsService],
})
export class CommandsModule {}
