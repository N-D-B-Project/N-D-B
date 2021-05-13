const BaseCommand = require("../../Utils/Structures/BaseCommand");

const Discord = require("discord.js");
const { inspect } = require("util");
const { Type } = require("@anishshobith/deeptype");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class EvalCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'eval',
      category: 'Developer Tools',
      aliases: ['ev'],
      usage: '',
      description: 'Exibe informações do Bot',
      ownerOnly: true
    });
  }

  async run(client, message, args) {
    const msg = message;
    if(!args.length) return msg.channel.send("Preciso de um Code para Evaluate")
    let code = args.join(" ");
    code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    let evaled;
    try {
        const start = process.hrtime();
        evaled = eval(code);
        if(evaled instanceof Promise) {
            evaled = await evaled;
        }
        const stop = process.hrtime(start);
        const response = [
            `**Output: ** \`\`\`js\n${this.clean(inspect(evaled, { depth: 0}))}\n\`\`\``,
            `**Type: ** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
            `**Time Taken: ** \`\`\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms\`\`\``,
        ]
        const res = response.join('\n');
        if(res.length < 2000) {
            await msg.channel.send(res)
        } else {
            const output = new Discord.MessageAttachment(Buffer.from(res), 'output.txt');
            await msg.channel.send(output);
        }
        
    } catch (err) {
        return msg.channel.send(`Erro: \`\`\`xl\n${this.clean(err)}\`\`\``);
    }
  }

  clean(text) {
      if(typeof text === 'string') {
        text = text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `${String.fromCharCode(8203)}`)
            .replace(new RegExp(process.env.TOKEN, 'gi'), '****')
      }
      return text;
  }
}