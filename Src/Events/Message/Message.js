const BaseEvent = require("../../utils/structures/BaseEvent");
const GuildConfig = require("../../database/schemas/GuildConfig");
const mongoose = require("mongoose");
const Config = require("../../../Config/Config.json");
//const checkOwner = require("../../Tools/checkOwner");
const Blacklist = require('../../database/schemas/Blacklist');
const Disable = require('../../database/schemas/DisableCommands')
const ms = require('ms');

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");

    this.buckets = new Map();
  }

  async run(client, message, guild) {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id,
    });
    if (!guildConfig) {
      await new GuildConfig({
        guildName: message.guild.name,
        guildId: message.guild.id,
        prefix: "&",
      }).save();
      console.log(`Server: ${message.guild.name} Salvo na DataBase!`);
    }
    // Disable.findOne({
    //   name: "global"
    // }, (err, data) => {
    //   if (err) console.log(err);
    //       if (data) {
    //           if (data.cmds.includes(command)) return message.channel.send("Este comando está desabilitado no momento").then(async m => await m.delete({ timeout: 5000 }));
    //       } 
    // });

    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}> `);

    const Prefix = guildConfig.get("prefix") || mentionRegexPrefix;
    const FindPrefix = guildConfig.prefix;
    const prefix = message.content.match(mentionRegexPrefix) ?
      message.content.match(mentionRegexPrefix)[0] : Prefix;
    client.prefix = prefix;

    if(!message.content.startsWith(prefix)) return;

    if(message.content.match(mentionRegex)) message.channel.send(`Meu Prefix para \`${message.guild.name}\` é: ${FindPrefix}`);

    if(message.content.startsWith(prefix)) {
      const [ cmd, ...args ] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));

      /*
      if (!client.owners.includes(message.author.id)) {
        let remaining = await this._runLimits(message, command);
        if (remaining) {
          remaining = ms(remaining - Date.now(), { long: true });
          message.channel.send(`Sorry **${message.author}**, you have to wait **${remaining}** before running this command.`);
          return;
        }
      }
      */

      if(command) {
        const blacklistData = await Blacklist.findOne({ User: message.author.id });
        if (blacklistData && blacklistData.Blacklist === true) {
          return message.reply('Você está na **Blacklist** do Bot portanto não pod utilizar nenhum comando')
       }

        if (command.ownerOnly && !client.Tools.checkOwner(message.author.id)) {
          return message.reply("Comando restrito para o Dono do Bot");
        }

        if(command.guildOnly && !message.guild) {
          return message.reply("Comando Restrito para outro Servidor");
        }
        
        if(command.testOnly && !client.Tools.checkTestGuild(message.guild)) {
          return message.reply("Este Comando só pode ser utilizado no servidor de testes do meu Dev!")
        }

        if(command.nsfw && !message.channel.nsfw) {
          return message.reply(
            "Esse Comando só pode ser executado em canais NSFW"
          );
        }

        if(command.args && !args.length) {
          return message.reply(
            "Esse comando precisa de mais Args para funcionar"
          );
        }

        if (message.guild) {
          const userPermCheck = command.userPerms
            ? client.defaultPerms.add(command.userPerms)
            : client.defaultPerms;
          if (userPermCheck) {
            const missing = message.channel
              .permissionsFor(message.member)
              .missing(userPermCheck);
            if (missing.length) {
              return message.reply(
                `You are missing ${client.Tools.formatArray(
                  missing.map(client.Tools.formatPerms)
                )} permissions, you need them to use this command!`
              );
            }
          }

          const botPermCheck = command.botPerms
            ? client.defaultPerms.add(command.botPerms)
            : client.defaultPerms;
          if (botPermCheck) {
            const missing = message.channel
              .permissionsFor(message.member)
              .missing(botPermCheck);
            if (missing.length) {
              return message.reply(
                `Faltam as seguintes Permissões: ${client.Tools.formatArray(
                  missing.map(client.Tools.formatPerms)
                )} Para executar esse Comando!`
              );
            }
          }
        }

        //const WOKCommands = require('wokcommands');

        //const instance = WOKCommands;
        
        command.run(client, message, args /*, instance */);
      }
    }
  }
/*
  _timeout(userId, commandName) {
		return () => {
			const bucket = this.buckets.get(`${userId}-${commandName}`);
			if (bucket && bucket.timeout) {
				this.client.clearTimeout(bucket.timeout);
			}

			this.buckets.delete(`${userId}-${commandName}`);
		};
	}

	_runLimits(message, command) {
		const tout = this._timeout(message.author.id, command.name);

		let bucket = this.buckets.get(`${message.author.id}-${command.name}`);
		if (!bucket) {
			bucket = {
				reset: command.ratelimit.reset,
				remaining: command.ratelimit.bucket,
				timeout: this.client.setTimeout(tout, command.ratelimit.reset)
			};

			this.buckets.set(`${message.author.id}-${command.name}`, bucket);
		}

		if (bucket.remaining === 0) {
			if (command.ratelimit.stack) {
				if (bucket.limited) {
					if (bucket.timeout) {
						this.client.clearTimeout(bucket.timeout);
					}

					bucket.reset = (bucket.resetsIn - Date.now()) + command.ratelimit.reset;
					bucket.timeout = this.client.setTimeout(tout, bucket.reset);
					bucket.resetsIn = Date.now() + bucket.reset;
				}

				bucket.limited = true;
			}

			if (!bucket.resetsIn) {
				bucket.resetsIn = Date.now() + bucket.reset;
			}

			return bucket.resetsIn;
		}

		--bucket.remaining;
		return null;
  };
  */
};
