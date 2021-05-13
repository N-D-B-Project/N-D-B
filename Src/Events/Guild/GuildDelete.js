// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../../Utils/Structures/BaseEvent');
const GuildConfig = require('../../Database/Schemas/GuildConfig');
const GuildConfigRoles = require('../../Database/Schemas/GuildRoles');
const GuildConfigChannels = require('../../Database/Schemas/GuildRoles');

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
    try {
      const guildConfig = await GuildConfig.deleteOne({
        guildId: guild.id,
      });
      const guildConfigRoles = await GuildConfigRoles.deleteOne({
        guildId: guild.id,
      });
      const guildConfigChannels = await GuildConfigChannels.deleteOne({
        guildId: guild.id,
      });
      client.logger.dtb(`N-D-B Saiu do Server ${guild.name}. Database Atualizada!`);
    } catch (err) {
      client.logger.error(err);
    }
  }
}