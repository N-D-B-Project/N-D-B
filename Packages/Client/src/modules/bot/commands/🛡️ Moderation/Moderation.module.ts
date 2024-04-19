import { Module } from "@nestjs/common";
import * as Commands from "./commands";

@Module({
	providers: [...Object.values(Commands)],
})
export class ModerationModule {}
