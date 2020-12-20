require("dotenv").config();
const { ShardingManager } = require("discord.js");
const config = require("../Config/Config.json");

const shards = new ShardingManager("./Src/Root.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
});

shards.on("shardCreate", shard =>{
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Launched Shard #${shard.id}`);
});

shards.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

shards.spawn(shards.totalShards, 10000);

