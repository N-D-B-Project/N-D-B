import { Global, Module, type Provider } from "@nestjs/common";
import { Extends } from "@/types/Constants";
import { Buttons } from "./Buttons.component";

const provider: Provider<Buttons> = {
	provide: Extends.Buttons,
	useClass: Buttons,
};

@Global()
@Module({
	providers: [provider],
	exports: [provider],
})
export class ComponentsModule {}
