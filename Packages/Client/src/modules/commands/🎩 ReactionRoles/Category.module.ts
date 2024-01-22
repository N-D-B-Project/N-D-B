import {
	ButtonsComponentsProvider,
	DatabaseProvider,
	ReactionRolesEmbedsProvider,
	ReactionRolesProvider,
	TranslateProvider,
} from "@/types/Providers";
import { Module } from "@nestjs/common";
import { CreateReactionCommand } from "./CreateReaction.command";
import { DeleteAllReactionsCommand } from "./DeleteAllReactions.command";
import { DeleteReactionCommand } from "./DeleteReaction.command";
import { EditReactionCommand } from "./EditReaction.command";
import { ReactionRolesMainSlashCommand } from "./Main.command";
import { ReactionTypesCommand } from "./ReactionTypes.command";

@Module({
	providers: [
		ReactionRolesMainSlashCommand,
		CreateReactionCommand,
		DeleteAllReactionsCommand,
		DeleteReactionCommand,
		EditReactionCommand,
		ReactionTypesCommand,
		TranslateProvider,
		DatabaseProvider,
		ReactionRolesProvider,
		ReactionRolesEmbedsProvider,
		ButtonsComponentsProvider,
	],
})
export class ReactionRolesCommands {}
