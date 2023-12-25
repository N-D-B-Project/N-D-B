import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { DatabaseProvider } from "@/types/Providers";
import { Global, Inject, Module, OnModuleInit } from "@nestjs/common";
import { I18nLoader, I18nModule } from "nestjs-i18n";
import { I18nService } from "./i18n.service";

@Global()
@Module({
	imports: [
		I18nModule.forRootAsync({
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
		}),
	],
	providers: [
		DatabaseProvider,
		{
			provide: Extends.Translate,
			useClass: I18nService,
		},
	],
})
export class i18nModule implements OnModuleInit {
	public constructor(@Inject(Extends.Translate) private readonly i18n: Ii18nService) {}

	public onModuleInit() {
		this.i18n.Logger();
	}
}
