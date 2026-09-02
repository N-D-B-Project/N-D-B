import { Global, Module } from "@nestjs/common";
import { CommandsService } from "./Commands.service.js";
import * as Commands from "./index.js";

@Global()
@Module({
	imports: [...Object.values(Commands)],
	providers: [CommandsService],
	exports: [CommandsService],
})
export class CommandsModule {}
