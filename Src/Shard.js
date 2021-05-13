require("dotenv").config();
const { ShardingManager } = require("discord.js");
const config = require("./Config/Config.json");
const colors = require("colors");
const logger = require("./Utils/Logger");
const AutoPoster = require('topgg-autoposter')

const shards = new ShardingManager("./Src/Root.js", {
    token: process.env.TOKEN,
    totalShards: "auto"
});

const poster = AutoPoster(process.env.TOPGG_API_TOKEN, shards)

poster.on('posted', () => {
    logger.log('Posted stats to top.gg')
});

shards.on("shardCreate", shard =>{
    logger.log(`Launched Shard #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);
