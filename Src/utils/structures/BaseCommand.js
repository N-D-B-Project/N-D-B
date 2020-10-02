module.exports = class BaseCommand {
  constructor(name, category, aliases) {
		this.name = name;
		this.aliases = [];
		this.description = 'No description provided.';
		this.category = 'Miscellaneous';
		this.usage = 'No usage provided.';
  }
}