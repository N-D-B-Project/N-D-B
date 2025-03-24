import { Module } from "@nestjs/common";
import { ConfigModule } from "./modules/config/config.module";

@Module({
	imports: [ConfigModule],
})
export class AppModule {}
