import { ButtonsComponentsProvider, DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [ButtonsComponentsProvider, TranslateProvider, DatabaseProvider],
})
export class ComponentsModule {}
