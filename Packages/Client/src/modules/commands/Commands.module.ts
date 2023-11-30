import { Extends, Services } from "@/types/Constants";
import {
  CommandProvider,
  DatabaseProvider,
  TranslateProvider
} from "@/types/Providers";
import {
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationBootstrap,
  OnModuleInit
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
  ChannelType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  InteractionType,
  codeBlock
} from "discord.js";
import { ExplorerService } from "necord";
import { Command } from "../../common/decorators/Commands.decorator";
import { DatabaseService } from "../database/database.service";
import { i18nService } from "../i18n/i18n.service";
import { CommandsDiscovery } from "./Commands.discovery";
import { CommandsService } from "./Commands.service";
import { MessageTools } from "./Message";

@Global()
@Module({
  providers: [CommandProvider, DatabaseProvider, TranslateProvider],
  exports: [CommandProvider]
})
export class CommandsModule implements OnModuleInit, OnApplicationBootstrap {
  public constructor(
    @Inject(Services.Database) private readonly database: DatabaseService,
    @Inject(Extends.Translate) private readonly Translate: i18nService,
    @Inject(Extends.Command) private readonly commandsService: CommandsService,
    private readonly client: Client,
    private readonly eventEmitter: EventEmitter2,
    private readonly explorerService: ExplorerService<CommandsDiscovery>
  ) {}

  private readonly logger = new Logger(CommandsModule.name);

  public async onModuleInit() {
    this.logger.log(`Started refreshing application commands`);
    return this.client.once("ready", async () =>
      this.explorerService.explore(Command.KEY).forEach(command => {
        this.commandsService.load(command);
      })
    );
  }

  public async onApplicationBootstrap() {
    this.client.on("messageCreate", async message => {
      if (message.author.bot) return;
      if (message.channel.type !== ChannelType.DM) {
        const { config: GuildConfig, status } = await this.checkGuildConfig(
          message.guild
        );
        if (status === "Created") {
          MessageTools.send(message.channel, {
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.guild.name,
                  iconURL: message.guild.iconURL()
                })
                .setTitle(
                  await this.Translate.Guild(
                    message,
                    "Events/MessageCreate:ConfigurationCreated:Title"
                  )
                )
                .setDescription(
                  (await this.Translate.Guild(
                    message,
                    "Events/MessageCreate:ConfigurationCreated:Description"
                  )) + codeBlock("JSON", JSON.stringify(GuildConfig, null, 3))
                )

                .setColor("#00c26f")
                .setTimestamp()
            ]
          });
        }

        const { Prefix: dbPrefix } = GuildConfig.Settings;
        const mentionRegex = RegExp(`<@!${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

        const Prefix = message.content.match(mentionRegexPrefix)
          ? message.content.match(mentionRegexPrefix)[0]
          : dbPrefix;
        if (message.content == Prefix) return;
        if (!message.content.startsWith(Prefix)) return;

        //TODO: Fix this, Doesn't working...
        if (message.content.match(mentionRegex)) {
          message.channel.send(
            await this.Translate.Guild(
              message,
              "Events/MessageCreate:MyPrefix",
              {
                GUILD_NAME: message.guild.name,
                PREFIX: Prefix
              }
            )
          );
          return;
        }

        if (message.content.startsWith(Prefix)) {
          this.eventEmitter.emit("commands.legacy", message, Prefix);
        }
      } else if (message.channel.type === ChannelType.DM) {
        this.eventEmitter.emit("commands.dm", message, "&");
      }
    });

    this.client.on("interactionCreate", async interaction => {
      if (interaction.type === InteractionType.ApplicationCommand)
        this.eventEmitter.emit(
          "commands.slash",
          interaction as CommandInteraction
        );
    });
  }

  private async checkGuildConfig(guild: Guild) {
    const repository = this.database.GuildRepo();
    let config = await repository.get(guild.id);

    if (!config) {
      return {
        status: "Created",
        config: await repository.getCreated(guild)
      };
    }

    return {
      status: "Found",
      config
    };
  }
}
