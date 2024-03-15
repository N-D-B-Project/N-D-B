import { Global, Module } from "@nestjs/common";
import { DeveloperToolsMainSlashCommand, EvalCommand, TestCommand } from "./commands";

@Global()
@Module({
	providers: [DeveloperToolsMainSlashCommand, EvalCommand, TestCommand],
})
export class DeveloperToolsModule {}
