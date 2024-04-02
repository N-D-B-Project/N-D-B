import { Module, Provider } from "@nestjs/common";
import { UserService } from "./user.service";

const provider: Provider<UserService> = {
	provide: "USER_SERVICE",
	useClass: UserService,
};

@Module({
	providers: [provider],
	exports: [provider],
})
export class UserModule {}
