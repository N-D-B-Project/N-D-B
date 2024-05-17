import { Services } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from "@nestjs/schedule";
import { IDatabaseService } from "../database/interfaces/IDatabaseService";

@Injectable()
export class ScheduleService {
	public constructor(@Inject(Services.Database) private readonly database: IDatabaseService) {}

	private readonly logger = new Logger(ScheduleService.name);

	private readonly premiumGuilds = [
		"679066351456878633",
		"717094267243462688",
		"732425112191762554",
		"965721821246812220",
		"975918150652682270",
	];

	private readonly premiumUsers = ["330047048009252864", "463476708834803725"];

  @Timeout(1000)
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async checkPermanentPremiumGuilds(): Promise<void> {
		const startTimestamp = new Date().getMilliseconds();
		this.logger.log("Start Checking Permanent Premium Guilds");
		for (const guild of await this.database.GuildRepo().getAll()) {
			if (this.premiumGuilds.includes(guild.id) && !guild.Settings.Premium) {
				await this.database.GuildRepo().guildSettings().update({
					where: {
						guildId: guild.id,
					},
					data: {
						Premium: true,
					},
				});
			}
		}
		const endTimestamp = new Date().getMilliseconds();
    const time = endTimestamp - startTimestamp
		this.logger.log(`Finished Checking Permanent Premium Guilds in ${time}ms`);
	}

  @Timeout(1000)
	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	public async checkPermanentPremiumUsers(): Promise<void> {
		const startTimestamp = new Date().getMilliseconds();
		this.logger.log("Start Checking Permanent Premium Users");
		for (const user of await this.database.UserRepo().getAll()) {
			if (this.premiumUsers.includes(user.id) && !user.Settings.Premium) {
				await this.database.UserRepo().userSettings().update({
					where: {
						userId: user.id,
					},
					data: {
						Premium: true,
					},
				});
			}
		}
		const endTimestamp = new Date().getMilliseconds();
    const time = endTimestamp - startTimestamp;
		this.logger.log(`Finished Checking Permanent Premium Users in ${time}ms`);
	}
}
