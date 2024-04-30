import { Module } from "@nestjs/common";
import * as Commands from "./index";

@Module({
	imports: [...Object.values(Commands)],
})
export class CommandsModule {}
