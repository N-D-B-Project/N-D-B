import { ButtonsComponentsProvider, DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Module } from "@nestjs/common";
import { ReactionRolesEmbedsProvider, ReactionRolesProvider } from "../types/providers";
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
