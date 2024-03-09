import { ButtonsComponentsProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [ButtonsComponentsProvider],
	exports: [ButtonsComponentsProvider],
})
export class ComponentsModule {}
