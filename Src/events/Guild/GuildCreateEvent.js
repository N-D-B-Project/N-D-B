// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');
module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }

  async run(client, guild) {
    try {
      const guildConfig = await GuildConfig.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      console.log('N-D-B Entrou no Server. Salvo na DataBase!');
    } catch (err) {
      console.log(err);
    }
  }
}