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
import type {
	CreateStatus,
	DeleteStatus,
	IReaction,
	REACTION_OPTIONS,
	UpdateStatus,
} from "./types";
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
		reaction: IReaction,
	): Promise<ReactionRolesEntity> {
		return await this.database.ReactionRolesRepo().getOne(guild, reaction);
	}

	public async Create(
		guild: Guild,
		reaction: IReaction,
	): Promise<{ status: CreateStatus }> {
		return await this.database.ReactionRolesRepo().create(guild, reaction);
	}

	public async Delete(
		guild: Guild,
		reaction: IReaction,
	): Promise<{ status: DeleteStatus }> {
		return await this.database.ReactionRolesRepo().delete(guild, reaction);
	}

	public async DeleteAll(
		guild: Guild,
	): Promise<{ status: DeleteStatus; count: number }> {
		return await this.database.ReactionRolesRepo().deleteMany(guild);
	}

	public async Update(
		guild: Guild,
		reaction: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: UpdateStatus;
		oldOption?: REACTION_OPTIONS;
	}> {
		return await this.database
			.ReactionRolesRepo()
			.update(guild, reaction, newOption);
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
