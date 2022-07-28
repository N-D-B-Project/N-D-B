import { GuildConfig as Schema } from "@Database/Schemas";
import { Logger, Mongoose } from "~/Utils/Tools";
import { Document } from "mongoose";
import { Guild } from "discord.js";

const logger: Logger = new Logger();

async function reactionFetch(guild: Guild, channel: string) {
  const data: Document = await Schema.findOne({ ID: guild.id });
  const GET: any = await data.get("ReactionRole");

  var RArray = [];
  var OBJ: {};

  for (let i = 0; i < GET.length; i++) {
    if (GET[i].channel == channel) {
      OBJ = GET[i];
      RArray.push(OBJ);
    }
  }
  return RArray;
  // GET.forEach(async (arr) => {
  //   if(arr.channel === channel) {

  //   }
  // });
}

async function reactionFetchAll(guild: Guild) {
  const data: Document = await Schema.findOne({ ID: guild.id });
  const GET: any = await data.get("ReactionRole");

  return GET;
}

export { reactionFetch, reactionFetchAll };

// async reactionFetch(guildId, msgId, emoji) {
//   if (!guildId) throw new TypeError("Guild não foi definido");
//   if (!client.fetchforguild.has(guildId)) {
//     let allrole = await serverset
//       .find({ guildId: guildId })
//       .sort([["guildId", "descending"]])
//       .exec();
//     let i = 0;
//     for (i; i < Object.keys(allrole).length; i++) {
//       await client.react.set(allrole[i].msgId + allrole[i].reaction, {
//         guildId: allrole[i].guildId,
//         msgId: allrole[i].msgId,
//         reaction: allrole[i].reaction,
//         roleId: allrole[i].roleId,
//         dm: allrole[i].dm,
//       });
//     }
//     client.fetchforguild.set(guildId, {
//       guildId: guildId,
//       totalreactions: Object.keys(allrole).length,
//     });
//   }
//   return client.react.get(msgId + emoji);
// }

// async reactionFetchAll(client) {
//   let all = await Schema.find({})
//     .sort([["guildId", "descending"]])
//     .exec();

//   return all;
// }
