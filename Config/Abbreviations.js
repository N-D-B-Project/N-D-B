const BaseCommand = require('../Src/Utils/Structures/BaseCommand');

module.exports = class TetsCommand extends BaseCommand {
  constructor() {
    super('tets', 'sf', []);
  }

  run(client, message, args) {

  // Client

  const ClientTag = client.user.tag;
  const ClientId = client.user.id;
  const ClientPicURL = client.user.displayAvatarURL();

  // Message

  const MSGSender = message.channel.send;
  const MSGDelete = message.delete;
  const MSGReply = message.reply;
  const MSGReact = message.react;
  const MSGContent = message.content;
  const MSGEmbed = Discord.MessageEmbed();

  // Mention

  const Mention = message.author;
  const MentionTag = message.author.tag;
  const MentionId = message.author.id;
  const MentionPicURL = message.author.displayAvatarURL();
  const FirstMention = message.author.users.first;
  const LatsMention = message.author.users.last;

  // Guild

  const guildName = message.guild.name;
  const guildId = message.guild.id;
  const guildIcon = message.guild.iconURL();
  const guildOwnerTag = message.guild.owner.user.tag;
  const guildOwnerId = message.guild.owner.id;
  const guildRegion = message.guild.region;
  const guildBoost = message.guild.premiumTier;
  const guildFilter = message.guild.explicitContentFilter;
  const guildVerification = message.guild.verificationLevel;
  const guildCreated = message.guild.createdTimestamp;
  const guildRoles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
  const guildEmojis = message.guild.emojis.cache;
  const guildMembers = message.guild.members.cache;
  const guildNormalMembers = message.guild.memberCount;
  //const guildBotMembers = message.guild.member.user.bot;
  const guildPremiumMembers = message.guild.premiumSubscriptionCount;
  //const guildMemberPresence = message.guild.member.presence.status;
  const guildChannels = message.guild.channels.cache;

    module.exports = {
      //Client
      ClientTag,
      ClientId,
      ClientPicURL,
    
      //Message
      MSGSender,
      MSGDelete,
      MSGReply,
      MSGReact,
      MSGContent,
      MSGEmbed,
    
      //Mention
      Mention,
      MentionTag,
      MentionId,
      MentionPicURL,
      FirstMention,
      LatsMention,
    
      //Guild
      guildName,
      guildId,
      guildIcon,
      guildOwnerTag,
      guildOwnerId,
      guildRegion,
      guildBoost,
      guildFilter,
      guildVerification,
      guildCreated,
      guildRoles,
      guildEmojis,
      guildMembers,
      guildNormalMembers,
      //guildBotMembers,
      guildPremiumMembers,
      //guildMemberPresence,
      guildChannels
    }
  }
}

