import { AlsProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";
import { AlsService } from "./als.service";

@Global()
@Module({
  providers: [AlsService, AlsProvider],
  exports: [AlsProvider]
})
export class AlsModule {}
