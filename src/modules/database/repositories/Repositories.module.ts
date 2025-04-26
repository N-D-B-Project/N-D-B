import { Repositories } from "@/types";
import { Global, Module, type Provider } from "@nestjs/common";
import { GuildRepository } from "./Guild.repository";
import { ReactionRolesRepository } from "./ReactionRoles.repository";
import { UserRepository } from "./User.repository";

const providers: Provider<
	GuildRepository | UserRepository | ReactionRolesRepository
>[] = [
	{
		provide: Repositories.Guild,
		useClass: GuildRepository,
	},
	{
		provide: Repositories.User,
		useClass: UserRepository,
	},
	{
		provide: Repositories.ReactionRoles,
		useClass: ReactionRolesRepository,
	},
];

@Global()
@Module({
	providers: [...providers],
	exports: [...providers],
})
export class RepositoriesModule {}
