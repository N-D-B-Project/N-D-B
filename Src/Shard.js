require("dotenv").config();
const { ShardingManager } = require("discord.js");
const config = require("../Config/Config.json");
const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
      seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

const shards = new ShardingManager("./Src/Root.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
});

shards.on("shardCreate", shard =>{
    console.log(" ")
    console.log(date.format(new Date()).grey, "Shards".cyan, "Launched  ", `Shard #${shard.id}`.magenta,"               INFO".yellow,"   Loaded".green)
    //console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Launched Shard #${shard.id}`);
});

shards.on('message', (shard, message) => {
	console.log(`Shard[${shard.id}] : ${message._eval} : ${message._result}`);
});

shards.spawn(shards.totalShards, 10000);


