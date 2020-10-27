module.exports = class BaseCommand {
  constructor(name, category, aliases, description, usage) {
    this.name = name;
    this.category = category || "Miscellaneous";
    this.aliases = aliases || [];
    this.description = description || "No description provided.";
    this.usage = usage || "No usage provided.";
  }
};
