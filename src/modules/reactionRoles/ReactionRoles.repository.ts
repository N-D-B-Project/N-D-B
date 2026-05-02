import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GuildReactionRoles } from "@ndb/database";
import type { Guild, TextChannel } from "discord.js";
import { Repository } from "typeorm";
import type { ReactionRolesEntity } from "./entities/ReactionRole.entity";
import type { IReactionRolesRepository } from "./interfaces/IReactionRoleRepository";
import {
	CreateStatus,
	DeleteStatus,
	type IReaction,
	type REACTION_OPTIONS,
	UpdateStatus,
} from "./types";

@Injectable()
export class ReactionRolesRepository implements IReactionRolesRepository {
	public constructor(
		@InjectRepository(GuildReactionRoles)
		private readonly rrRepo: Repository<GuildReactionRoles>,
	) {}

	public async getAll(guild: Guild): Promise<ReactionRolesEntity[]> {
		return await this.rrRepo.find({ where: { guildId: guild.id } });
	}

	public async getOne(guild: Guild, Reaction: IReaction): Promise<ReactionRolesEntity> {
		return await this.rrRepo.findOne({
			where: { guildId: guild.id, ...Reaction },
		});
	}

	public async getInChannel(guild: Guild, channel: TextChannel): Promise<ReactionRolesEntity[]> {
		return await this.rrRepo.find({
			where: { guildId: guild.id, channel: channel.id },
		});
	}

	private async checkIfExists(guild: Guild, reaction: IReaction): Promise<boolean> {
		return !!(await this.rrRepo.findOne({
			where: {
				guildId: guild.id,
				channel: reaction.channel,
				message: reaction.message,
				role: reaction.role,
				emoji: reaction.emoji,
				option: reaction.option,
			},
		}));
	}

	public async create(guild: Guild, reaction: IReaction): Promise<{ status: CreateStatus }> {
		if (await this.checkIfExists(guild, reaction)) {
			return { status: CreateStatus.UnableToCreate };
		}

		try {
			await this.rrRepo.save(
				this.rrRepo.create({
					guildId: guild.id,
					channel: reaction.channel,
					message: reaction.message,
					role: reaction.role,
					emoji: reaction.emoji,
					option: reaction.option,
				}),
			);
			return { status: CreateStatus.Created };
		} catch {
			return { status: CreateStatus.UnableToCreate };
		}
	}

	public async delete(guild: Guild, Reaction: IReaction): Promise<{ status: DeleteStatus }> {
		try {
			await this.rrRepo.delete({ guildId: guild.id, ...Reaction });
			return { status: DeleteStatus.Deleted };
		} catch {
			return { status: DeleteStatus.UnableToDelete };
		}
	}

	public async deleteMany(guild: Guild): Promise<{ status: DeleteStatus; count: number }> {
		const count = await this.rrRepo.count({ where: { guildId: guild.id } });
		try {
			await this.rrRepo.delete({ guildId: guild.id });
			return { status: DeleteStatus.Deleted, count };
		} catch {
			return { status: DeleteStatus.UnableToDelete, count };
		}
	}

	public async update(
		guild: Guild,
		reaction: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{ status: UpdateStatus; oldOption?: REACTION_OPTIONS }> {
		const existing = await this.rrRepo.findOne({
			where: {
				guildId: guild.id,
				channel: reaction.channel,
				message: reaction.message,
				role: reaction.role,
				emoji: reaction.emoji,
			},
		});

		if (!existing) return { status: UpdateStatus.UnableToUpdate };

		await this.rrRepo.update({ id: existing.id }, { option: newOption });

		return { status: UpdateStatus.Updated, oldOption: existing.option as REACTION_OPTIONS };
	}
}
