import { Extends, Services } from "@/types/Constants";
import { IDatabaseService, Ii18nService } from "@/types/Interfaces";
import { CommandProvider, DatabaseProvider, TranslateProvider } from "@/types/Providers";
import { Tools } from "@/utils/Tools";
import { Global, Inject, Logger, Module, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
	ChannelType,
	Client,
	CommandInteraction,
	EmbedBuilder,
	InteractionType,
	Message,
	codeBlock,
	userMention,
} from "discord.js";
import { ExplorerService } from "necord";
import { Command } from "../../common/decorators/Commands.decorator";
import { GuildEntity, UserEntity } from "../database/entities";
import { Context } from "./Commands.context";
import { CommandsDiscovery } from "./Commands.discovery";
import { CommandsService } from "./Commands.service";
import { MessageTools } from "./Message";

@Global()
@Module({
	providers: [CommandProvider, DatabaseProvider, TranslateProvider],
	exports: [CommandProvider],
})
export class CommandsModule implements OnModuleInit, OnApplicationBootstrap {
	public constructor(
		@Inject(Services.Database) private readonly database: IDatabaseService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		@Inject(Extends.Command) private readonly commandsService: CommandsService,
		private readonly client: Client,
		private readonly eventEmitter: EventEmitter2,
		private readonly explorerService: ExplorerService<CommandsDiscovery>,
	) {}

	private readonly logger = new Logger(CommandsModule.name);

	public async onModuleInit() {
		this.logger.log("Started refreshing application commands");
		return this.client.once("ready", async () => {
			for (const command of this.explorerService.explore(Command.KEY)) {
				this.commandsService.load(command);
			}
		});
	}

	public async onApplicationBootstrap() {
		this.client.on("messageCreate", async (message) => {
			let GuildPrefix = "";
			if (message.author.bot) return;
			const userConfig = await this.checkConfig(message, "User");
			if (message.channel.type !== ChannelType.DM) {
				const guildConfig = await this.checkConfig(message, "Guild");
				GuildPrefix = guildConfig.Settings.Prefix;
			}

			const UserPrefix = userConfig.Settings.Prefix;

			const mentionRegexPrefix = RegExp(`${userMention(this.client.user.id)} `);
			const Prefix = message.content.match(mentionRegexPrefix)
				? message.content.match(mentionRegexPrefix)[0]
				: message.channel.type !== ChannelType.DM
				  ? GuildPrefix
				  : UserPrefix;

			if (message.content === userMention(this.client.user.id)) {
				message.delete();
				const PrefixMessage = await MessageTools.send(
					message.channel,
					await this.Translate.Guild(message, "Events/MessageCreate:MyPrefix", {
						Guild: message.guild.name,
						User: userMention(message.author.id),
						Prefix,
						Time: `<t:${Math.floor(Date.now() / 1000 + 15)}:R>`,
					}),
				);
				await Tools.WAIT(15 * 1000);
				MessageTools.delete(PrefixMessage);
				return;
			}

			if (message.content.startsWith(Prefix)) {
				this.eventEmitter.emit("commands.legacy", message, Prefix);
			} else {
				const emojis = message.content.match(/(?<=:)([^:\s]+)(?=:)/g);
				if (emojis) {
					this.eventEmitter.emit("NotQuiteNitro", message, emojis);
				}
			}

			if (message.channel.type === ChannelType.DM) {
				this.eventEmitter.emit("commands.dm", message, Prefix);
			}
		});

		this.client.on("interactionCreate", async (interaction) => {
			if (interaction.type === InteractionType.ApplicationCommand)
				this.eventEmitter.emit("commands.slash", interaction as CommandInteraction);
		});
	}

	private async checkConfig(message: Message, type: "User" | "Guild") {
		if (type === "User") {
			let userConfig = await this.database.UserRepo().get(message.author.id);
			if (!userConfig) {
				userConfig = (await this.database.UserRepo().create(message.author)).callback as UserEntity;
				await this.sendCreateMessage(message, userConfig, false);
				return userConfig;
			}
			return userConfig;
		}
		let guildConfig = await this.database.GuildRepo().get(message.guildId);
		if (!guildConfig) {
			guildConfig = (await this.database.GuildRepo().create(message.guild)).callback as GuildEntity;
			await this.sendCreateMessage(message, guildConfig, true);
			return guildConfig;
		}
		return guildConfig;
	}

	private async sendCreateMessage(message: Message, config: UserEntity | GuildEntity, isGuild: boolean) {
		let _name = message.author.globalName;
		let _icon = message.author.displayAvatarURL();

		if (isGuild) {
			_name = message.guild.name;
			_icon = message.guild.iconURL();
		}
		const context = new Context(message, [], isGuild ? "None" : "DM");

		return MessageTools.send(isGuild ? message.channel : message.author, {
			embeds: [
				new EmbedBuilder()
					.setAuthor({
						name: _name,
						iconURL: _icon,
					})
					.setTitle(await this.Translate.TFunction(context, "Events/MessageCreate:ConfigurationCreated:Title"))
					.setDescription(
						(await this.Translate.TFunction(context, "Events/MessageCreate:ConfigurationCreated:Description")) +
							codeBlock("JSON", JSON.stringify(config, null, 3)),
					)
					.setColor("#00c26f")
					.setTimestamp(),
			],
		});
	}
}
