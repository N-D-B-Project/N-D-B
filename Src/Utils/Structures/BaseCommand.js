const { Util } = require('discord.js');
const { Permissions } = require('discord.js');

const DEFAULT_RATELIMIT = {
	reset: 5000,
	bucket: 1,
	stack: true
};
module.exports = class BaseCommand {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.category = options.category || 'General';
		this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.botPerms = new Permissions(options.botPerms).freeze();
		this.guildOnly = options.guildOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
		this.args = options.args || false;
		this.ratelimit = Util.mergeDefault(DEFAULT_RATELIMIT, options.ratelimit || DEFAULT_RATELIMIT);
	}

	async run(message, args) {
		throw new Error(`Comando \`${this.name}\` Não proveu um metodo Run!`);
	}

};