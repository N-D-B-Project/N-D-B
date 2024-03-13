import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { TranslateProvider } from "@/types/Providers";
import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { AcceptLanguageResolver, I18nLoader, I18nModule as _I18nModule } from "nestjs-i18n";

@Global()
@Module({
	imports: [
		_I18nModule.forRootAsync({
			useFactory: async () => {
				return {
					fallbackLanguage: "pt-BR",
					disableMiddleware: false,
					loader: I18nLoader,
					logging: false,
					loaderOptions: {
						includeSubfolders: true,
						type: "json",
						path: "./src/common/Languages/i18n",
						watch: true,
					},
				};
			},
			resolvers: [AcceptLanguageResolver],
		}),
	],
	providers: [TranslateProvider],
	exports: [TranslateProvider],
})
export class I18nModule implements OnModuleInit {
	public constructor(@Inject(Extends.Translate) private readonly i18n: Ii18nService) {}

	public onModuleInit() {
		this.i18n.Logger();
	}
}
