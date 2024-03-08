import { ReactionRolesLocalization as Localization } from "@/common/Languages/Localization/ReactionRoles";
import { Injectable, UseGuards } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SlashCommandBuilder } from "discord.js";
import { CommandConfig, CommandPermissions, SlashCommand } from "../../../common/decorators";
import { OwnerPermissionGuard } from "../../../common/guards/Permissions/Owner.Guard";
import { CommandContext } from "../../commands/Commands.context";
import { RunSubCommandEvent } from "../../commands/Commands.discovery";

@UseGuards(OwnerPermissionGuard)
@Injectable()
export class ReactionRolesMainSlashCommand {
	public constructor(private readonly eventEmitter: EventEmitter2) {}

	@SlashCommand({
		data: new SlashCommandBuilder()
			.setName("reactionrole")
			.setNameLocalizations(Localization.name)
			.setDescription("Category 🎩 ReactionRole")
			.setDescriptionLocalizations(Localization.description)
			.setDMPermission(false)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("create")
					.setNameLocalizations(Localization.options.create.name)
					.setDescription("Create a ReactionRole in the server")
					.setDescriptionLocalizations(Localization.options.create.description)
					.addChannelOption((option) =>
						option
							.setName("channel")
							.setNameLocalizations(Localization.options.create.options.channel.name)
							.setDescription("Channel where the ReactionRole will be created")
							.setDescriptionLocalizations(Localization.options.create.options.channel.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("message")
							.setNameLocalizations(Localization.options.create.options.message.name)
							.setDescription("Message ID where the member will react")
							.setDescriptionLocalizations(Localization.options.create.options.message.description)
							.setRequired(true),
					)
					.addRoleOption((option) =>
						option
							.setName("role")
							.setNameLocalizations(Localization.options.create.options.role.name)
							.setDescription("Role to be used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.create.options.role.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("emoji")
							.setNameLocalizations(Localization.options.create.options.emoji.name)
							.setDescription("Emoji to be used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.create.options.emoji.description)
							.setRequired(true),
					)
					.addNumberOption((option) =>
						option
							.setName("type")
							.setDescriptionLocalizations(Localization.options.create.options.type.name)
							.setDescription("ReactionRole Type (1-6) (/reactionroles types)")
							.setDescriptionLocalizations(Localization.options.create.options.type.description)
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("delete")
					.setNameLocalizations(Localization.options.delete.name)
					.setDescription("Delete")
					.setDescriptionLocalizations(Localization.options.delete.description)
					.addChannelOption((option) =>
						option
							.setName("channel")
							.setNameLocalizations(Localization.options.delete.options.channel.name)
							.setDescription("Channel where the ReactionRole is located")
							.setDescriptionLocalizations(Localization.options.delete.options.channel.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("message")
							.setNameLocalizations(Localization.options.delete.options.message.name)
							.setDescription("Message ID used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.delete.options.message.description)
							.setRequired(true),
					)
					.addRoleOption((option) =>
						option
							.setName("role")
							.setNameLocalizations(Localization.options.delete.options.role.name)
							.setDescription("Role used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.delete.options.role.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("emoji")
							.setNameLocalizations(Localization.options.delete.options.emoji.name)
							.setDescription("Emoji used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.delete.options.emoji.description)
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("edit")
					.setNameLocalizations(Localization.options.edit.name)
					.setDescription("Edit a ReactionRole")
					.setDescriptionLocalizations(Localization.options.edit.description)
					.addChannelOption((option) =>
						option
							.setName("channel")
							.setNameLocalizations(Localization.options.edit.options.channel.name)
							.setDescription("Channel where the ReactionRole is located")
							.setDescriptionLocalizations(Localization.options.edit.options.channel.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("message")
							.setNameLocalizations(Localization.options.edit.options.message.name)
							.setDescription("Message ID used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.edit.options.message.description)
							.setRequired(true),
					)
					.addRoleOption((option) =>
						option
							.setName("role")
							.setNameLocalizations(Localization.options.edit.options.role.name)
							.setDescription("Role used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.edit.options.role.description)
							.setRequired(true),
					)
					.addStringOption((option) =>
						option
							.setName("emoji")
							.setNameLocalizations(Localization.options.edit.options.emoji.name)
							.setDescription("Emoji used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.edit.options.emoji.description)
							.setRequired(true),
					)
					.addRoleOption((option) =>
						option
							.setName("new_role")
							.setNameLocalizations(Localization.options.edit.options.newRole.name)
							.setDescription("New role to be used in ReactionRole")
							.setDescriptionLocalizations(Localization.options.edit.options.role.description)
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("fetch")
					.setNameLocalizations(Localization.options.fetch.name)
					.setDescription("Find the list of ReactionRoles on the server")
					.setDescriptionLocalizations(Localization.options.fetch.description)
					.addStringOption((option) =>
						option
							.setName("type")
							.setNameLocalizations(Localization.options.fetch.options.type.name)
							.setDescription("Type of Fetch")
							.setDescriptionLocalizations(Localization.options.fetch.options.type.description)
							.setRequired(true)
							.setAutocomplete(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("delete_all")
					.setNameLocalizations(Localization.options.deleteall.name)
					.setDescription("Find the list of ReactionRoles on the server")
					.setDescriptionLocalizations(Localization.options.deleteall.description),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("types")
					.setNameLocalizations(Localization.options.types.name)
					.setDescription("Find the list of ReactionRoles on the server")
					.setDescriptionLocalizations(Localization.options.types.description),
			),
		type: "Main",
		deployMode: "Test",
	})
	@CommandConfig({
		category: "🎩 ReactionRoles",
	})
	@CommandPermissions({
		bot: ["ManageRoles", "AddReactions", "EmbedLinks", "SendMessages"],
		user: ["ManageRoles", "AddReactions", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext) {
		const Payload = new RunSubCommandEvent()
			.setAdditional("Sub")
			.setContext(context)
			.setSubList([
				{ name: "create" },
				{ name: "delete" },
				{ name: "edit" },
				{ name: "fetch" },
				{ name: "types" },
				{ name: "delete_all" },
			]);

		this.eventEmitter.emit("commands.sub", Payload);
	}
}
