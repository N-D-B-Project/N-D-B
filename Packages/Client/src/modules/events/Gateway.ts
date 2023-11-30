import { AlsStore, Config } from "@/types";
import { Repositories } from "@/types/Constants";
import { Tools } from "@/utils/Tools";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AsyncLocalStorage } from "async_hooks";
import { ActivityType, Client, PresenceData } from "discord.js";
import { Context, ContextOf, On, Once } from "necord";

@Injectable()
export class GatewayEvents {
  public constructor(
    @Inject(Repositories.ALS) private readonly als: AsyncLocalStorage<AlsStore>,
    private readonly config: ConfigService
  ) {}

  private readonly logger = new Logger(GatewayEvents.name);

  @Once("ready")
  public async onReady(@Context() [client]: ContextOf<"ready">) {
    await Tools.WAIT(2000);
    this.logger.log(`Bot logged in as ${client.user.username}`);
    this.logger.log(
      `${this.als.getStore()["LegacyCommands"].size} Legacy Commands`
    );
    this.logger.log(
      `${this.als.getStore()["SlashCommands"].size} Slash Commands`
    );
    this.logger.log(`${this.als.getStore()["SubCommands"].size} Sub Commands`);

    await this._setPresence(client);
  }

  @On("warn")
  public onWarn(@Context() [data]: ContextOf<"warn">) {
    this.logger.warn(data);
  }

  @Once("debug")
  public async onDebug(@Context() [data]: ContextOf<"debug">) {
    if (this.config.getOrThrow<Config["Debug"]>("Debug").Client)
      this.logger.debug(data);
  }

  @On("error")
  public async onError(@Context() [error]: ContextOf<"error">) {
    this.logger.error(error);
  }

  private async _setPresence(client: Client) {
    const presences: PresenceData = {
      activities: [
        {
          type: ActivityType.Custom,
          name: "WorkingAt",
          state: `${""}N-D-B | 🎵 Music Player - 🚧 WIP`,
          url: "https://discord.gg/5CHARxbaRk"
        },
        {
          type: ActivityType.Watching,
          name: "Best Bot of Discord"
        },
        {
          type: ActivityType.Streaming,
          name: "Watch my Creator Streams on Twitch!",
          url: "https://Twitch.TV/NedcloarBR"
        },
        {
          type: ActivityType.Custom,
          name: "TotalStatus",
          state: `👤 ${client.users.cache.size} Users - 🏠 ${client.guilds.cache.size} Guilds`
        }
      ],
      status: "dnd"
    };

    function setPresence() {
      const activity =
        presences.activities[
          Math.floor(Math.random() * presences.activities.length)
        ];
      client.user.setPresence({
        activities: [activity]
      });
    }
    setPresence();
    setInterval(() => setPresence(), 120_000);
  }
}
