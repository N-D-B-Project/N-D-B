import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import type { Guild, TextChannel } from "discord.js";
// biome-ignore lint/style/useImportType: <Cannot useImportType in Injected classes>
import { CustomPrismaService } from "nestjs-prisma";
import type { ExtendedPrismaClient } from "../database/prisma.client";
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
		@Inject(Services.Prisma)
		private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
	) {}

	public async getAll(guild: Guild): Promise<ReactionRolesEntity[]> {
		return await this.prisma.client.guildReactionRoles.findMany({
			where: { guildId: guild.id },
		});
	}

	public async getOne(
		guild: Guild,
		Reaction: IReaction,
	): Promise<ReactionRolesEntity> {
		return await this.prisma.client.guildReactionRoles.findFirst({
			where: {
				guildId: guild.id,
				...Reaction,
			},
		});
	}

	public async getInChannel(
		guild: Guild,
		channel: TextChannel,
	): Promise<ReactionRolesEntity[]> {
		return await this.prisma.client.guildReactionRoles.findMany({
			where: {
				guildId: guild.id,
				channel: channel.id,
			},
		});
	}

	private async checkIfExists(
		guild: Guild,
		reaction: IReaction,
	): Promise<boolean> {
		return (
			(await this.prisma.client.guildReactionRoles.checkIfExists(
				guild.id,
				reaction,
			)) !== null
		);
	}

	public async create(
		guild: Guild,
		reaction: IReaction,
	): Promise<{ status: CreateStatus }> {
		const Check = await this.checkIfExists(guild, reaction);

		if (Check) return { status: CreateStatus.UnableToCreate };
		await this.prisma.client.client.guildReactionRoles
			.create({
				data: {
					channel: reaction.channel,
					emoji: reaction.emoji,
					role: reaction.role,
					option: reaction.option,
					message: reaction.message,
					guild: {
						connectOrCreate: {
							where: {
								id: guild.id,
							},
							create: {
								id: guild.id,
								Name: guild.name,
							},
						},
					},
				},
			})
			.catch((err) => {
				if (err) return { status: CreateStatus.UnableToCreate };
			});

		return {
			status: CreateStatus.Created,
		};
	}

	public async delete(
		guild: Guild,
		Reaction: IReaction,
	): Promise<{ status: DeleteStatus }> {
		await this.prisma.client.client.guildReactionRoles
			.deleteMany({
				where: {
					guildId: guild.id,
					...Reaction,
				},
			})
			.catch((err) => {
				if (err) return { status: DeleteStatus.UnableToDelete };
			});
		return { status: DeleteStatus.Deleted };
	}

	public async deleteMany(
		guild: Guild,
	): Promise<{ status: DeleteStatus; count: number }> {
		const count = await this.prisma.client.client.guildReactionRoles.count({
			where: { guildId: guild.id },
		});
		await this.prisma.client.guildReactionRoles
			.deleteMany({
				where: {
					guildId: guild.id,
				},
			})
			.catch((err) => {
				if (err) return { status: DeleteStatus.UnableToDelete };
			});

		return { status: DeleteStatus.Deleted, count };
	}

	public async update(
		guild: Guild,
		reaction: IReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: UpdateStatus;
		oldOption?: REACTION_OPTIONS;
	}> {
		const Check = await this.checkIfExists(guild, reaction);
		if (!Check) return { status: UpdateStatus.UnableToUpdate };
		const oldOption = reaction.option;
		reaction.option = newOption;
		await this.prisma.client.client.guildReactionRoles.update({
			where: {
				id: guild.id,
				channel: reaction.channel,
				emoji: reaction.emoji,
				role: reaction.role,
				message: reaction.message,
				option: oldOption,
			},
			data: {
				...reaction,
			},
		});

		return { status: UpdateStatus.Updated, oldOption };
	}
}
