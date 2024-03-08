import { ReactionRolesEmbeds } from "../ReactionRoles.embeds";
import { ReactionRolesRepository } from "../ReactionRoles.repository";
import { ReactionRolesService } from "../ReactionRoles.service";
import { ReactionRoles } from "./constants";

export const ReactionRolesProvider = {
	provide: ReactionRoles.Service,
	useClass: ReactionRolesService,
};

export const ReactionRolesEmbedsProvider = {
	provide: ReactionRoles.Embeds,
	useClass: ReactionRolesEmbeds,
};

export const ReactionRolesRepoProvider = {
	provide: ReactionRoles.Repository,
	useClass: ReactionRolesRepository,
};
