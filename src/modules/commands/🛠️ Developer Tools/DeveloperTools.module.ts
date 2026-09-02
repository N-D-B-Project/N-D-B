import { Module } from "@nestjs/common";
import * as Commands from "./commands/index.js";

@Module({
	providers: [...Object.values(Commands)],
})
export class DeveloperToolsModule {}
