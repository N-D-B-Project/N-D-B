require("dotenv").config();
const { ShardingManager } = require("discord.js");
const Config = require("./Config/Config.json");
const Logger = require("./Utils/Tools/Logger");
const AutoPoster = require('topgg-autoposter')

const shards = new ShardingManager("./Src/Root.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
});

const poster = AutoPoster(process.env.TOPGG_API_TOKEN, shards)

poster.on('posted', () => {
    Logger.log('Posted stats to top.gg')
});

shards.on("shardCreate", shard =>{
    Logger.log(`Launched Shard #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);
