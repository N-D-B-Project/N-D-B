import { Global, Module } from "@nestjs/common";
import { CommandsService } from "./Commands.service";
import * as Commands from "./index";

@Global()
@Module({
	imports: [...Object.values(Commands)],
	providers: [CommandsService],
	exports: [CommandsService],
})
export class CommandsModule {}
