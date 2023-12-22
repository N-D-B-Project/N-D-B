import { PrismaProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [PrismaProvider],
	exports: [PrismaProvider],
})
export class PrismaModule {}
