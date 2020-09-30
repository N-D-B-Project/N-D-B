const BaseEvent = require("../../utils/structures/BaseEvent");
const Config = require("../../../Config/Config.json");
const mongoose = require("mongoose");
const GuildConfig = require("../../database/schemas/GuildConfig");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message, guild) {
    const FindRole = await GuildConfig.findOne({ guildId: message.guild.id})

    const usersMap = new Map();
    const LIMIT = 10;
    const TIME = 10000;
    const DIFF = 2000;
    const REMOVE = 50000

    if(usersMap.has(message.author.id)) {
      const userData = usersMap.get(message.author.id)
      const { lastMessage, timer } = userData;
      const difference = message.createdTimestamp - lastMessage.createdTimestamp
      //console.log(difference)
      let msgCount = userData.msgCount;
      if(difference > DIFF) {
        //console.log(timer);
        clearTimeout(timer);
        //console.log("Timeout limpo")
        userData.msgCount = 1;
        userData.lastMessage = message;
        userData.timer = setTimeout(() => {
          usersMap.delete(message.author.id);
          //console.log("usersMap removido")
        }, TIME)
        usersMap.set(message.author.id, userData);
      } else {
          ++msgCount;
          if(parseInt(msgCount) === LIMIT) {
          const Role = message.guild.roles.cache.get(`${FindRole}`)
          message.member.roles.add(Role);
          message.channel.send("Membro Silenciado pro Spam")
          setTimeout(() => {
            message.member.roles.remove(Role)
            message.channel.send("Membro não está mais silenciado")
          }, REMOVE)
        } else {
          userData.msgCount = msgCount;
          usersMap.set(message.author.id, userData);
        }
      } 
    } else {
      let fn = setTimeout(() => {
        
      }, TIME);
      usersMap.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn
      });
    }
  }
}