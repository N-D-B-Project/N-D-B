/*
{
    "ClientTag": "client.user.tag",
    "ClientId": "client.user.id",
    "ClientPicURL": "client.user.displayAvatarURL",
    "MSGSender": "message.channel.send",
    "MSGDelete": "message.delete",
    "MSGReply": "message.reply",
    "MSGReact": "message.react",
    "MSGContent": "message.content",
    "Mention": "message.author",
    "MentionTag": "message.author.tag",
    "MentionId": "message.author.id",
    "MentionPicURL": "message.author.displayAvatarURL",
    "FirstMention": "message.author.users.first",
    "GuildMembers" : "message.guild.members.get",
    "GuildId": "message.guild.id"
}
*/

const Discord = require("discord.js");

// Client Abbreviations

const ClientTag = client.user.tag;
const ClientId = client.user.id;
const ClientPicURL = client.user.displayAvatarURL;

// Message

const MSGSender = message.channel.send;
const MSGDelete = message.delete;
const MSGReply = message.reply;
const MSGReact = message.react;
const MSGContent = message.content;
const MSGEmbed = Discord.MessageEmbed;

// Mention

const Mention = message.author;
const MentionTag = message.author.tag;
const MentionId = message.author.id;
const MentionPicURL = message.author.displayAvatarURL;
const FirstMention = message.author.users.first;

// GuildId

const GuildMembers = message.guild.members.get;
const GuildTag = message.guild.tag;
const GuildId = message.guild.id;