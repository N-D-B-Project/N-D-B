const BaseEvent = require('../../Utils/Structures/BaseEvent');
const GuildConfig = require('../../Database/Schemas/GuildConfig');
const GuildConfigRoles = require('../../Database/Schemas/GuildRoles');
const GuildConfigChannels = require('../../Database/Schemas/GuildRoles');

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
      const guildConfigRoles = await GuildConfigRoles.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      const guildConfigChannels = await GuildConfigChannels.create({
        guildId: guild.id,
        guildName: guild.name,
      });
      client.logger.dtb('N-D-B Entrou no Server:' +guild.name+'. Salvo na DataBase!');
    } catch (err) {
      client.logger.error(err);
    }
  }
}