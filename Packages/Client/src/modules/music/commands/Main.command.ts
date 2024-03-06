import { MusicLocalization as Localization } from "@/common/Languages/Localization/Music";
import { CommandConfig, CommandPermissions, SlashCommand } from "@/common/decorators";
import { CommandContext } from "@/modules/commands/Commands.context";
import { RunSubCommandEvent } from "@/modules/commands/Commands.discovery";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SlashCommandBuilder } from "discord.js";

export class MusicMainSlashCommand {
	public constructor(private readonly eventEmitter: EventEmitter2) {}

	@SlashCommand({
		data: new SlashCommandBuilder()
			.setName("music")
			.setNameLocalizations(Localization.name)
			.setDescription("Category 🎵 Music")
			.setDescriptionLocalizations(Localization.description)
			.setDMPermission(false)
			.addSubcommand((command) =>
				command
					.setName("play")
					.setNameLocalizations(Localization.options.play.name)
					.setDescription("Search a Music or Playlist and Play it on a Voice Channel")
					.setDescriptionLocalizations(Localization.options.play.description)
					.addStringOption((option) =>
						option
							.setName("query")
							.setNameLocalizations(Localization.options.play.options.query.name)
							.setDescription("<URL or Name> of the Music or Playlist")
							.setDescriptionLocalizations(Localization.options.play.options.query.description)
							.setRequired(true),
					),
			)
			.addSubcommand((command) =>
				command
					.setName("now_playing")
					.setNameLocalizations(Localization.options.nowplaying.name)
					.setDescription("Show the current playing song and more info")
					.setDescriptionLocalizations(Localization.options.nowplaying.description),
			)
			.addSubcommand((command) =>
				command
					.setName("join")
					.setNameLocalizations(Localization.options.join.name)
					.setDescription("The bot enter in you voice channel and initialize an player")
					.setDescriptionLocalizations(Localization.options.join.description),
			)
			.addSubcommand((command) =>
				command
					.setName("leave")
					.setNameLocalizations(Localization.options.leave.name)
					.setDescription("Leaves from voice channel")
					.setDescriptionLocalizations(Localization.options.leave.description),
			)
			.addSubcommand((command) =>
				command
					.setName("pause")
					.setNameLocalizations(Localization.options.pause.name)
					.setDescription("Pause the music queue")
					.setDescriptionLocalizations(Localization.options.pause.description),
			)
			.addSubcommand((command) =>
				command
					.setName("resume")
					.setNameLocalizations(Localization.options.resume.name)
					.setDescription("Resume the music queue")
					.setDescriptionLocalizations(Localization.options.resume.description),
			)
			.addSubcommand((command) =>
				command
					.setName("stop")
					.setNameLocalizations(Localization.options.stop.name)
					.setDescription("Stop the music queue")
					.setDescriptionLocalizations(Localization.options.stop.description),
			),
		deployMode: "Test",
		type: "Main",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	async onCommandRun([client, context]: CommandContext): Promise<void> {
		const Payload = new RunSubCommandEvent()
			.setAdditional("Sub")
			.setContext(context)
			.setSubList([
				{ name: "play" },
				{ name: "now_playing" },
				{ name: "join" },
				{ name: "leave" },
				{ name: "pause" },
				{ name: "resume" },
				{ name: "stop" },
			]);
		this.eventEmitter.emit("commands.sub", Payload);
	}
}
