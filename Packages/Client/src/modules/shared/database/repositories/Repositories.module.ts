import { ReactionRolesRepoProvider } from "@/modules/bot/reactionRoles/types/providers";
import { Global, Module, Provider } from "@nestjs/common";
import { Repositories } from "../types/constants";
import { APIUserRepository } from "./APIUser.repository";
import { GuildRepository } from "./Guild.repository";
import { UserRepository } from "./User.repository";

const providers: Provider<GuildRepository | UserRepository | APIUserRepository>[] = [
	{
		provide: Repositories.Guild,
		useClass: GuildRepository,
	},
	{
		provide: Repositories.User,
		useClass: UserRepository,
	},
	{
		provide: Repositories.APIUser,
		useClass: APIUserRepository,
	},
];

@Global()
@Module({
	providers: [...providers, ReactionRolesRepoProvider],
	exports: [...providers, ReactionRolesRepoProvider],
})
export class RepositoriesModule {}
