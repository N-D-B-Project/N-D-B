import { Services } from "@/types/Constants";
import { Inject, Injectable } from "@nestjs/common";
import { Guild, TextChannel } from "discord.js";
import { ReactionRolesEntity } from "../database/entities";
import { PrismaService } from "../database/prisma/Prisma.service";
import { IReactionRolesRepository } from "./interfaces/IReactionRoleRepository";
import { REACTION_OPTIONS, iReaction } from "./types";

@Injectable()
export class ReactionRolesRepository implements IReactionRolesRepository {
	public constructor(@Inject(Services.Prisma) private readonly prisma: PrismaService) {}

	public async getAll(guild: Guild): Promise<Array<ReactionRolesEntity>> {
		return await this.prisma.guildReactionRoles.findMany({
			where: { guildId: guild.id },
		});
	}

	public async getOne(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
	): Promise<ReactionRolesEntity> {
		const data = await this.getAll(guild);
		return data.filter(async (reaction) => {
			reaction.Channel === Channel &&
				reaction.Message === Message &&
				reaction.Role === Role &&
				reaction.Emoji === Emoji &&
				reaction.Option === Option;
		})[0];
	}

	public async getInChannel(guild: Guild, channel: TextChannel): Promise<Array<ReactionRolesEntity>> {
		const data = await this.getAll(guild);
		return data.filter(async (reaction) => reaction.Channel === channel.id);
	}

	private async checkIfExists(guild: Guild, { Channel, Message, Role, Emoji, Option }: iReaction): Promise<boolean> {
		const GetGuild = await this.getAll(guild);
		let Verify = false;
		for (const reaction of GetGuild) {
			if (
				reaction.Channel === Channel &&
				reaction.Message === Message &&
				reaction.Role === Role &&
				reaction.Emoji === Emoji &&
				reaction.Option === Option
			) {
				Verify = true;
			}
		}

		return Verify;
	}

	public async create(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
	): Promise<{ status: "UnableToCreate" | "Created" }> {
		const data: iReaction = {
			Channel,
			Message,
			Role,
			Emoji,
			Option,
		};

		const Check = await this.checkIfExists(guild, data);

		if (Check) return { status: "UnableToCreate" };
		await this.prisma.guildReactionRoles
			.create({
				data: {
					Channel,
					Message,
					Role,
					Emoji,
					Option,
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
				if (err) return { status: "UnableToCreate" };
			});

		return {
			status: "Created",
		};
	}

	public async delete(
		guild: Guild,
		{ Channel, Message, Role, Emoji }: iReaction,
	): Promise<{ status: "UnableToDelete" | "Deleted" }> {
		await this.prisma.guildReactionRoles
			.deleteMany({
				where: {
					guildId: guild.id,
					Channel,
					Message,
					Role,
					Emoji,
				},
			})
			.catch((err) => {
				if (err) return { status: "UnableToDelete" };
			});
		return { status: "Deleted" };
	}

	public async deleteMany(guild: Guild): Promise<{ status: "UnableToDelete" | "Deleted"; count: number }> {
		const count = await this.prisma.guildReactionRoles.count({
			where: { guildId: guild.id },
		});
		await this.prisma.guildReactionRoles
			.deleteMany({
				where: {
					guildId: guild.id,
				},
			})
			.catch((err) => {
				if (err) return { status: "UnableToDelete" };
			});

		return { status: "Deleted", count };
	}

	public async update(
		guild: Guild,
		{ Channel, Message, Role, Emoji, Option }: iReaction,
		newOption: REACTION_OPTIONS,
	): Promise<{
		status: "UnableToUpdate" | "Updated";
		oldOption?: REACTION_OPTIONS;
	}> {
		const data: iReaction = {
			Channel,
			Message,
			Role,
			Emoji,
			Option,
		};

		const Check = await this.checkIfExists(guild, data);
		if (!Check) return { status: "UnableToUpdate" };

		data.Option = newOption;
		await this.prisma.guildReactionRoles.updateMany({
			where: {
				id: guild.id,
				Channel,
				Message,
				Role,
				Emoji,
				Option,
			},
			data,
		});

		return { status: "Updated", oldOption: Option };
	}
}
