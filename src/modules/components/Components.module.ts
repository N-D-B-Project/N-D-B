import { Extends } from "@/types";
import { Global, Module, type Provider } from "@nestjs/common";
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
