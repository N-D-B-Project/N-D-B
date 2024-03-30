import { ReactionRolesRepoProvider } from "@/modules/bot/reactionRoles/types/providers";
import { Global, Module, Provider } from "@nestjs/common";
import { Repositories } from "../types/constants";
import { GuildRepository } from "./Guild.repository";
import { UserRepository } from "./User.repository";

const providers: Array<Provider<GuildRepository | UserRepository>> = [
	{
		provide: Repositories.Guild,
		useClass: GuildRepository,
	},
	{
		provide: Repositories.User,
		useClass: UserRepository,
	},
];

@Global()
@Module({
	providers: [...providers, ReactionRolesRepoProvider],
	exports: [...providers, ReactionRolesRepoProvider],
})
export class RepositoriesModule {}
