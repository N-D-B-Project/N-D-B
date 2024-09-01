import type { IDatabaseService } from "@/modules/database/interfaces/IDatabaseService";
import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import type {
	Client,
	CommandInteraction,
	Guild,
	Message,
	Role,
	TextChannel,
} from "discord.js";
import type { ReactionRolesEntity } from "./entities/ReactionRole.entity";
import type { IReactionRolesEmbeds, IReactionRolesService } from "./interfaces";
import type { IReaction, REACTION_OPTIONS } from "./types";
import { ReactionRoles } from "./types/constants";

@Injectable()
export class ReactionRolesService implements IReactionRolesService {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(ReactionRoles.Embeds) private readonly embeds: IReactionRolesEmbeds,
	) {}

	public async Embeds(): Promise<IReactionRolesEmbeds> {
		return this.embeds;
	}

	public async getAll(guild: Guild): Promise<ReactionRolesEntity[]> {
		return await this.database.ReactionRolesRepo().getAll(guild);
	}

	public async getInChannel(
		guild: Guild,
		channel: TextChannel,
	): Promise<ReactionRolesEntity[]> {
		return await this.database.ReactionRolesRepo().getInChannel(guild, channel);
	}

	public async getOne(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<ReactionRolesEntity> {
		return await this.database.ReactionRolesRepo().getOne(guild, {
			Channel,
			Message,
			Role,
			Emoji,
			Option,
		});
	}

	public async Create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }> {
		return await this.database.ReactionRolesRepo().create(guild, {
			Channel,
			Message,
			Role,
			Emoji,
			Option,
		});
	}

	public async Delete(
		guild: Guild,
		{ Channel, Message, Role, Emoji }: IReaction,
	): Promise<{ status: "UnableToDelete" | "Deleted" }> {
		return await this.database.ReactionRolesRepo().delete(guild, {
			Channel,
			Message,
			Role,
			Emoji,
		});
	}

	public async DeleteAll(
		guild: Guild,
	): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }> {
		return await this.database.ReactionRolesRepo().deleteMany(guild);
	}

	public async Update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}> {
		return await this.database.ReactionRolesRepo().update(
			guild,
			{
				Channel,
				Message,
				Role,
				Emoji,
				Option,
			},
			newOption,
		);
	}

	public async CheckParams(
		client: Client<boolean>,
		interaction: CommandInteraction,
		channel: TextChannel,
		messageId: string,
		message: Message<boolean>,
		role: Role,
		emoji: string,
	) {
		if (!message) {
			return await interaction.reply({
				embeds: [await this.embeds.MessageNotFoundEmbed(interaction)],
			});
		}
	}
}
