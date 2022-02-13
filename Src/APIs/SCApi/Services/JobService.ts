import schedule from "node-schedule";
import { Logger } from "@Utils/Tools";
import { Job } from "~/Types";

export default class JobService {
  private logger: Logger = new Logger();
  public constructor(private Jobs: Job[]) {}

  public start(): void {
    for (const job of this.Jobs) {
      schedule.scheduleJob(job.schedule, async () => {
        try {
          if (job.log) {
            // this.logger.info();
          }

          await job.run();

          if (job.log) {
            this.logger.info(`Job: ${job.name} Completed`);
          }
        } catch (error) {
          this.logger.error(`Job: ${job.name} Error: ${error}`);
        }
      });
      this.logger.info(`Job: ${job.name} Scheduled to run ${job.schedule}`);
    }
  }
}
