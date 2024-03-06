import { Redis } from "ioredis";

export class RedisClient extends Redis {
	public constructor() {
		super({
			port: process.env.RedisPort as unknown as number,
			host: process.env.RedisHost,
		});
	}
}
