// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../../Utils/Structures/BaseEvent');
const GuildConfig = require('../../Database/Schemas/GuildConfig');

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
    try {
      const guildConfig = await GuildConfig.deleteOne({
        guildId: guild.id,
      });
      console.log('N-D-B Saiu no Server. Database Atualizada!');
    } catch (err) {
      console.log(err);
    }
  }
}