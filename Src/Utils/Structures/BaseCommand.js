const { Permissions } = require('discord.js');
module.exports = class BaseCommand {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'Nenhuma descrição';
		this.category = options.category || 'General';
		this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
		this.examples = options.examples || [];
        this.disabled = options.disabled || false;
        this.cooldown = "cooldown" in options ? options.cooldown : 5 || 5;
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.botPerms = new Permissions(options.botPerms).freeze();
		this.guildOnly = options.guildOnly || false;
		this.testOnly = options.testOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
		this.args = options.args || false;
	}

	async run(message, args) {
		throw new Error(`Comando \`${this.name}\` Não proveu um método Run!`);
	}

	reload() {
        return this.store.load(this.file.path);
    }
};