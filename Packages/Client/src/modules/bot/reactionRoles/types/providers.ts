import { Provider } from "@nestjs/common";
import { ReactionRolesEmbeds } from "../ReactionRoles.embeds";
import { ReactionRolesRepository } from "../ReactionRoles.repository";
import { ReactionRolesService } from "../ReactionRoles.service";
import { ReactionRoles } from "./constants";

export const ReactionRolesProvider: Provider<ReactionRolesService> = {
	provide: ReactionRoles.Service,
	useClass: ReactionRolesService,
};

export const ReactionRolesEmbedsProvider: Provider<ReactionRolesEmbeds> = {
	provide: ReactionRoles.Embeds,
	useClass: ReactionRolesEmbeds,
};

export const ReactionRolesRepoProvider: Provider<ReactionRolesRepository> = {
	provide: ReactionRoles.Repository,
	useClass: ReactionRolesRepository,
};
