const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const BaseEvent = require('../Structures/BaseEvent');

module.exports = class EventHandler {

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

    async loadEvents() {
		return glob(`${this.directory}Events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event: ${name} não exportou uma Class`);
				const event = new File(this.client, name);
				if (!(event instanceof BaseEvent)) throw new TypeError(`Event: ${name} não esta em Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](event.name, (...args) => event.run(this.client, ...args));
			}
		});
	}
}