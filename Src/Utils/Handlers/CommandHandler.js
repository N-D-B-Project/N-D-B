const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('../Structures/BaseCommand');
module.exports = class Registry {

    constructor(client) {
        this.client = client;
    }

    isClass(input) {
		return typeof input === 'function' &&
        typeof input.prototype === 'object' &&
        input.toString().substring(0, 5) === 'class';
    }

    get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

    async loadCommands() {
        return glob(`${this.directory}Commands/**/*.js`).then(commands => {
            for (const commandFile of commands) {
                delete require.cache[commandFile];
                const { name } = path.parse(commandFile);
                const File = require(commandFile);
                if (!this.isClass(File)) throw new TypeError(`Comando: \`${name}\` Não Exportou uma Class`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Comando: \`${name}\` Não está em Commands`);
                this.client.commands.set(command.name, command);
                if (command.aliases.length) {
                    for (const alias of command.aliases) {
                        this.client.aliases.set(alias, command.name);
                    }
                }
                if (command.category) {
                    for (const category of command.category) {
                        this.client.category.set(command.category, command)
                    }
                }
            }
        });
    }
}