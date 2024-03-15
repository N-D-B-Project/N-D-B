import { Services } from "@/types/Constants";
import { Global, Module, Provider } from "@nestjs/common";
import { PrismaService } from "./Prisma.service";

const provider: Provider<PrismaService> = {
	provide: Services.Prisma,
	useClass: PrismaService,
};

@Global()
@Module({
	providers: [provider],
	exports: [provider],
})
export class PrismaModule {}
