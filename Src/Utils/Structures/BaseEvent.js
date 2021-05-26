module.exports = class BaseEvent {
  constructor(client, name, options = {}) {
    this.name = options.name || name;
    this.partials = ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER', 'GUILD_MESSAGE_REACTIONS'],
    this.client = client || options.client;
    this.type = options.once ? 'once' : 'on';
    this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
  }

  async run(client, options) {
    throw new Error(`Um método Run não foi implementado em: ${this.name}`);
  }

  reload() {
    return this.store.load(this.file.path);
  }
}