import { Global, Module } from "@nestjs/common";
import { ScheduleModule as _ScheduleModule } from "@nestjs/schedule";
import { ScheduleService } from "./schedule.service";

@Global()
@Module({
	imports: [_ScheduleModule.forRoot()],
	providers: [
		{
			provide: "SCHEDULE_SERVICE",
			useClass: ScheduleService,
		},
	],
})
export class ScheduleModule {}
