import { Logger } from "@nestjs/common";
import { Cluster } from "ioredis";

export class RedisClient extends Cluster {
	public constructor() {
		super([{ host: process.env.RedisHost, port: Number(process.env.RedisPort) }]);

		const logger = new Logger(RedisClient.name);
		this.ping((err, result) => {
			logger.log("Pinging...");
			if (err) {
				logger.error(`Error when trying to connect: ${err.message}`);
			} else {
				logger.log(`Response: ${result}`);
			}
			this.quit();
		});
	}
}
